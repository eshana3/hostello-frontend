"use client";
import { useState, useRef, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import clsx from "clsx";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder = "Type a message…" }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex items-end gap-2 p-3 bg-[#0D0E1C] border-t border-white/[0.08]">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={clsx(
            "w-full resize-none rounded-2xl border border-white/[0.08] bg-[#080912] px-4 py-2.5 text-sm text-white placeholder:text-[#3D3B62]",
            "focus:outline-none focus:ring-2 focus:ring-[#4C3699] focus:border-[#7C3AED] focus:bg-[#1A1830]",
            "transition-all leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          style={{ maxHeight: 120, overflowY: "auto" }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-sm",
          value.trim() && !disabled
            ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-[#3D2785]"
            : "bg-[#252248] text-[#3D3B62] cursor-not-allowed"
        )}
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
