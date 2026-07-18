"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useChatMessages } from "@/hooks/useChats";
import { useSocket } from "@/providers/SocketProvider";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import OnlineIndicator from "@/components/chat/OnlineIndicator";
import type { Chat } from "@/types/chat";
import { ArrowLeft, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { authFetch } from "@/lib/api";

const TYPING_TIMEOUT_MS = 2500;

export default function ChatWindowPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const router = useRouter();
  const { socket, currentUserId, onlineUsers } = useSocket();
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const [otherTyping, setOtherTyping] = useState(false);

  const { data: chats = [] } = useQuery<Chat[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await authFetch("/api/chats");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });
  const chat = chats.find(c => c.id === chatId);

  const { messages, isLoading, sendMessage, markRead } = useChatMessages(chatId);

  useEffect(() => {
    if (chat) markRead();
  }, [chatId, chat, markRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const otherId = chat?.participants.find(p => p !== currentUserId) ?? "";
  const otherName = chat?.participantNames[otherId] ?? "Chat";
  const otherAvatar = chat?.participantAvatars[otherId];
  const isOnline = onlineUsers.has(otherId);

  // Typing indicator — emits "typing" once when the user starts (not on every
  // keystroke), then "stop_typing" after a pause with no further input.
  const handleTyping = useCallback(() => {
    if (!socket || !otherId) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", { chatId, to: otherId });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit("stop_typing", { chatId, to: otherId });
    }, TYPING_TIMEOUT_MS);
  }, [socket, otherId, chatId]);

  useEffect(() => {
    if (!socket) return;
    const onTypingEvent = (payload: unknown) => {
      const { chatId: incomingChatId } = (payload ?? {}) as { chatId?: string };
      if (incomingChatId === chatId) setOtherTyping(true);
    };
    const onStopTypingEvent = (payload: unknown) => {
      const { chatId: incomingChatId } = (payload ?? {}) as { chatId?: string };
      if (incomingChatId === chatId) setOtherTyping(false);
    };
    socket.on("typing", onTypingEvent);
    socket.on("stop_typing", onStopTypingEvent);
    return () => {
      socket.off("typing", onTypingEvent);
      socket.off("stop_typing", onStopTypingEvent);
    };
  }, [socket, chatId]);

  // Reset typing state when switching chats
  useEffect(() => {
    setOtherTyping(false);
    isTypingRef.current = false;
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [chatId]);

  return (
    <div className="flex flex-col h-[calc(100vh-56px-64px)] md:h-[calc(100vh-56px)] bg-[#0D0D1A]">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0D0B1E] border-b border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] z-10">
        <button onClick={() => router.push("/chats")}
          className="p-1.5 rounded-lg hover:bg-[#151521] text-[#9CA3AF] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-shrink-0">
          <img src={otherAvatar} alt={otherName} className="w-9 h-9 rounded-full bg-[#1E1E2E]" />
          <div className="absolute bottom-0 right-0">
            <OnlineIndicator online={isOnline} size="sm" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{otherName}</p>
          {otherTyping ? (
            <p className="text-xs text-[#FF9B3D] font-medium flex items-center gap-1">
              <span className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-[#FF9B3D] animate-bounce [animation-delay:-0.2s]" />
                <span className="w-1 h-1 rounded-full bg-[#FF9B3D] animate-bounce [animation-delay:-0.1s]" />
                <span className="w-1 h-1 rounded-full bg-[#FF9B3D] animate-bounce" />
              </span>
              typing…
            </p>
          ) : (
            <p className="text-xs text-[#9CA3AF]">{isOnline ? "Online now" : "Offline"}</p>
          )}
        </div>

        {chat?.productId && (
          <Link href={`/product/${chat.productId}`}
            className="flex items-center gap-1.5 bg-[#151521] border border-[#1E1E2E] rounded-xl px-2.5 py-1.5 hover:bg-[#1E1E2E] transition-colors max-w-[140px]">
            {chat.productImageUrl && (
              <img src={chat.productImageUrl} alt="" className="w-6 h-6 rounded-lg object-cover flex-shrink-0" />
            )}
            <span className="text-xs font-medium text-[#FF6B00] truncate">{chat.productTitle}</span>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
        {isLoading ? (
          <div className="flex justify-center pt-10">
            <Loader2 className="w-7 h-7 text-[#FFD4A0] animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
            <div className="w-14 h-14 rounded-2xl bg-[#151521] flex items-center justify-center">
              <Package className="w-7 h-7 text-[#6B7280]" />
            </div>
            <p className="text-[#9CA3AF] text-sm font-medium">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const prevMsg = messages[i - 1];
            const showName = !prevMsg || prevMsg.senderId !== msg.senderId;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === currentUserId}
                showName={showName}
              />
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} onTyping={handleTyping} />
    </div>
  );
}
