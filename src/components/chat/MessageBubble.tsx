import clsx from "clsx";
import type { Message } from "@/types/chat";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showName?: boolean;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export default function MessageBubble({ message, isOwn, showName }: MessageBubbleProps) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-[#5E5B82] bg-[#131425] border border-white/[0.08] px-3 py-1 rounded-full">{message.content}</span>
      </div>
    );
  }

  return (
    <div className={clsx("flex gap-2 mb-1", isOwn ? "flex-row-reverse" : "flex-row")}>
      {!isOwn && (
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(message.senderName)}&backgroundColor=7C3AED`}
          alt={message.senderName}
          className="w-7 h-7 rounded-full flex-shrink-0 mt-1"
        />
      )}

      <div className={clsx("flex flex-col max-w-[70%]", isOwn ? "items-end" : "items-start")}>
        {showName && !isOwn && (
          <span className="text-xs text-[#5E5B82] font-semibold mb-1 ml-1">{message.senderName}</span>
        )}

        <div className={clsx(
          "px-3.5 py-2 rounded-2xl text-sm leading-relaxed",
          isOwn
            ? "bg-[#7C3AED] text-white rounded-br-sm shadow-sm shadow-[#3D2785]"
            : "bg-[#1A1830] border border-[#252248] text-[#F0EEFF] rounded-bl-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
        )}>
          {message.content}
        </div>

        <div className={clsx("flex items-center gap-1 mt-0.5 px-1", isOwn ? "flex-row-reverse" : "flex-row")}>
          <span className="text-[10px] text-[#3D3B62]">{formatTime(message.createdAt)}</span>
          {isOwn && (
            message.read
              ? <CheckCheck className="w-3 h-3 text-[#C4B5FD]" />
              : <Check className="w-3 h-3 text-[#3D3B62]" />
          )}
        </div>
      </div>
    </div>
  );
}
