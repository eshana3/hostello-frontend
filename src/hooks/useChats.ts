"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/SocketProvider";
import type { Chat, Message } from "@/types/chat";

export function useChats() {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const query = useQuery<Chat[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await fetch("/api/chats");
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
      const res = await fetch(`/api/chats/${chatId}`);
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
    socket.emit("join_chat", chatId);

    const handler = (msg: unknown) => {
      const message = msg as Message;
      if (message.chatId === chatId) {
        setLocalMessages(prev => {
          const exists = prev.some(m => m.id === message.id);
          return exists ? prev : [...prev, message];
        });
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    };

    socket.on("new_message", handler);
    return () => {
      socket.off("new_message", handler);
      socket.emit("leave_chat", chatId);
    };
  }, [socket, chatId, queryClient]);

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
      // Real-time via socket
      socket.emit("send_message", {
        chatId,
        content: content.trim(),
        senderId: currentUserId,
      });
    }
    // Also persist via REST (works without socket)
    await fetch(`/api/chats/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim(), senderId: currentUserId }),
    });
  }, [chatId, socket, currentUserId]);

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
