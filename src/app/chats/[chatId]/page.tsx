"use client";
import { useEffect, useRef } from "react";
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

export default function ChatWindowPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const router = useRouter();
  const { currentUserId, onlineUsers } = useSocket();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: chats = [] } = useQuery<Chat[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await fetch("/api/chats");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });
  const chat = chats.find(c => c.id === chatId);

  const { messages, isLoading, sendMessage, markRead } = useChatMessages(chatId);

  useEffect(() => {
    if (chat) markRead();
  }, [chatId, chat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const otherId = chat?.participants.find(p => p !== currentUserId) ?? "";
  const otherName = chat?.participantNames[otherId] ?? "Chat";
  const otherAvatar = chat?.participantAvatars[otherId];
  const isOnline = onlineUsers.has(otherId);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#080912]">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0D0B1E] border-b border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] z-10">
        <button onClick={() => router.push("/chats")}
          className="p-1.5 rounded-lg hover:bg-[#131425] text-[#5E5B82] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-shrink-0">
          <img src={otherAvatar} alt={otherName} className="w-9 h-9 rounded-full bg-[#1A1830]" />
          <div className="absolute bottom-0 right-0">
            <OnlineIndicator online={isOnline} size="sm" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{otherName}</p>
          <p className="text-xs text-[#5E5B82]">{isOnline ? "Online now" : "Offline"}</p>
        </div>

        {chat?.productId && (
          <Link href={`/product/${chat.productId}`}
            className="flex items-center gap-1.5 bg-[#2D1B69] border border-[#3D2785] rounded-xl px-2.5 py-1.5 hover:bg-[#3D2785] transition-colors max-w-[140px]">
            {chat.productImageUrl && (
              <img src={chat.productImageUrl} alt="" className="w-6 h-6 rounded-lg object-cover flex-shrink-0" />
            )}
            <span className="text-xs font-medium text-[#8B5CF6] truncate">{chat.productTitle}</span>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
        {isLoading ? (
          <div className="flex justify-center pt-10">
            <Loader2 className="w-7 h-7 text-[#C4B5FD] animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
            <div className="w-14 h-14 rounded-2xl bg-[#131425] flex items-center justify-center">
              <Package className="w-7 h-7 text-[#3D3B62]" />
            </div>
            <p className="text-[#5E5B82] text-sm font-medium">No messages yet. Say hello!</p>
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
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
