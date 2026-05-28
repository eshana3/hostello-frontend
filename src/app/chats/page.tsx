"use client";
import { useChats } from "@/hooks/useChats";
import { useSocket } from "@/providers/SocketProvider";
import OnlineIndicator from "@/components/chat/OnlineIndicator";
import Link from "next/link";
import { MessageCircle, Inbox } from "lucide-react";
import clsx from "clsx";
import type { Chat } from "@/types/chat";

function formatRelativeTime(iso?: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function ChatRow({ chat, currentUserId, isOnline }: { chat: Chat; currentUserId: string; isOnline: boolean }) {
  const otherId = chat.participants.find(p => p !== currentUserId) ?? "";
  const otherName = chat.participantNames[otherId] ?? "Unknown";
  const otherAvatar = chat.participantAvatars[otherId];
  const isUnread = chat.unreadCount > 0 && chat.lastMessageSenderId !== currentUserId;

  return (
    <Link href={`/chats/${chat.id}`}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#131425] transition-colors cursor-pointer border-b border-white/[0.08] last:border-0">
      <div className="relative flex-shrink-0">
        <img src={otherAvatar} alt={otherName} className="w-11 h-11 rounded-full bg-[#1A1830]" />
        <div className="absolute bottom-0 right-0">
          <OnlineIndicator online={isOnline} size="sm" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={clsx("text-sm truncate", isUnread ? "font-bold text-white" : "font-semibold text-white/60")}>
            {otherName}
          </span>
          <span className="text-[11px] text-white/40 flex-shrink-0">{formatRelativeTime(chat.lastMessageTime)}</span>
        </div>
        {chat.productTitle && (
          <p className="text-[11px] text-[#A78BFA] font-medium truncate mt-0.5">{chat.productTitle}</p>
        )}
        <p className={clsx("text-xs truncate mt-0.5", isUnread ? "text-white font-medium" : "text-white/40")}>
          {chat.lastMessageSenderId === currentUserId ? "You: " : ""}{chat.lastMessage ?? "Start the conversation"}
        </p>
      </div>

      {isUnread && chat.unreadCount > 0 && (
        <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
        </div>
      )}
    </Link>
  );
}

export default function ChatsPage() {
  const { data: chats = [], isLoading } = useChats();
  const { onlineUsers, currentUserId } = useSocket();

  return (
    <div className="min-h-screen bg-[#080912]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-14 z-10 bg-[#080912]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2D1B69] flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-[#A78BFA]" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Messages</h1>
            {chats.filter(c => c.unreadCount > 0 && c.lastMessageSenderId !== currentUserId).length > 0 && (
              <span className="ml-1 bg-[#7C3AED] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {chats.filter(c => c.unreadCount > 0 && c.lastMessageSenderId !== currentUserId).reduce((s, c) => s + c.unreadCount, 0)}
              </span>
            )}
          </div>
        </div>

        {/* Chat list */}
        <div className="bg-[#131425] border border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.30)] mx-4 my-4 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col gap-3 p-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-11 h-11 rounded-full bg-[#252248]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[#252248] rounded w-1/3" />
                    <div className="h-2.5 bg-[#252248] rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#131425] flex items-center justify-center">
                <Inbox className="w-8 h-8 text-[#3D3B62]" />
              </div>
              <p className="text-white font-semibold">No messages yet</p>
              <p className="text-white/40 text-sm text-center px-6">Start a chat by clicking "Chat with Seller" on any product listing</p>
            </div>
          ) : (
            chats.map(chat => {
              const otherId = chat.participants.find(p => p !== currentUserId) ?? "";
              return (
                <ChatRow
                  key={chat.id}
                  chat={chat}
                  currentUserId={currentUserId}
                  isOnline={onlineUsers.has(otherId)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
