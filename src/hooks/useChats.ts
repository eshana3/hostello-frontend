"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/SocketProvider";
import { authFetch } from "@/lib/api";
import type { Chat, Message } from "@/types/chat";

export function useChats() {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const query = useQuery<Chat[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await authFetch("/api/chats");
      if (!res.ok) throw new Error("Failed to fetch chats");
      return res.json();
    },
  });

  useEffect(() => {
    if (!socket) return;
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    };
    socket.on("chat_updated", handler);
    return () => socket.off("chat_updated", handler);
  }, [socket, queryClient]);

  const totalUnread = (query.data ?? []).reduce((sum, c) => sum + c.unreadCount, 0);
  return { ...query, totalUnread };
}

export function useChatMessages(chatId: string) {
  const { socket, currentUserId } = useSocket();
  const queryClient = useQueryClient();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const initializedRef = useRef(false);

  const query = useQuery<Message[]>({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const res = await authFetch(`/api/chats/${chatId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!chatId,
  });

  // Sync localMessages with fetched data on first load
  useEffect(() => {
    if (query.data && !initializedRef.current) {
      setLocalMessages(query.data);
      initializedRef.current = true;
    }
  }, [query.data]);

  // Join chat room and listen for new messages
  useEffect(() => {
    if (!socket || !chatId) return;
    socket.emit("join_chat", { chatId });

    const handler = (payload: unknown) => {
      // Backend emits { chatId, message: { _id, sender, text, timestamp, read } }
      const { chatId: incomingChatId, message: rawMsg } = payload as any;
      if (incomingChatId !== chatId) return;

      const senderId = rawMsg.sender?.toString() ?? "";
      // Skip echo of own messages — already added as optimistic update
      if (senderId === currentUserId) return;
      // Resolve sender name from cached chat participants
      const chats = queryClient.getQueryData<Chat[]>(["chats"]) ?? [];
      const cachedChat = chats.find(c => c.id === chatId);
      const senderName = cachedChat?.participantNames[senderId] ?? "Unknown";

      const message: Message = {
        id: rawMsg._id?.toString() ?? `socket_${Date.now()}`,
        chatId: incomingChatId,
        senderId,
        senderName,
        content: rawMsg.text ?? "",
        createdAt: rawMsg.timestamp ?? new Date().toISOString(),
        read: rawMsg.read ?? false,
      };

      setLocalMessages(prev => {
        const exists = prev.some(m => m.id === message.id);
        return exists ? prev : [...prev, message];
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    };

    socket.on("new_message", handler);
    return () => {
      socket.off("new_message", handler);
      socket.emit("leave_chat", chatId);
    };
  }, [socket, chatId, queryClient, currentUserId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const optimisticMsg: Message = {
      id: `local_${Date.now()}`,
      chatId,
      senderId: currentUserId,
      senderName: "You",
      content: content.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Optimistic update
    setLocalMessages(prev => [...prev, optimisticMsg]);

    if (socket?.connected) {
      // Real-time via socket — backend expects { to: recipientUserId, text }
      // Get the other participant's ID from the cached chat list
      const chats = queryClient.getQueryData<Chat[]>(["chats"]) ?? [];
      const chat = chats.find(c => c.id === chatId);
      // participants array in our proxy shape only contains the OTHER person's ID
      const recipientId = chat?.participants[0];

      if (recipientId) {
        socket.emit("send_message", { to: recipientId, text: content.trim() });
      } else {
        // Fallback: REST (no socket recipient info)
        // Backend sendMessage expects { text }, not { content }
        await authFetch(`/api/chats/${chatId}`, {
          method: "POST",
          body: JSON.stringify({ text: content.trim() }),
        }).catch(() => {});
      }
    } else {
      // No socket — persist via REST only
      await authFetch(`/api/chats/${chatId}`, {
        method: "POST",
        body: JSON.stringify({ text: content.trim() }),
      }).catch(() => {});
    }
  }, [chatId, socket, currentUserId, queryClient]);

  const markRead = useCallback(() => {
    fetch(`/api/chats/${chatId}/read`, { method: "POST" }).catch(() => {});
    if (socket) socket.emit("mark_read", { chatId, userId: currentUserId });
    queryClient.invalidateQueries({ queryKey: ["chats"] });
  }, [chatId, socket, currentUserId, queryClient]);

  return {
    messages: localMessages,
    isLoading: query.isLoading,
    sendMessage,
    markRead,
  };
}
