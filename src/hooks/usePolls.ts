"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/SocketProvider";
import { useToast } from "@/providers/ToastProvider";
import { useEffect } from "react";
import type { Poll, PollReply } from "@/types/poll";

export function usePolls() {
  return useQuery<Poll[]>({
    queryKey: ["polls"],
    queryFn: async () => {
      const res = await fetch("/api/polls");
      if (!res.ok) throw new Error("Failed to fetch polls");
      return res.json();
    },
  });
}

export function usePoll(id: string) {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { toast } = useToast();

  const query = useQuery<{ poll: Poll; replies: PollReply[] }>({
    queryKey: ["poll", id],
    queryFn: async () => {
      const res = await fetch(`/api/polls/${id}`);
      if (!res.ok) throw new Error("Failed to fetch poll");
      return res.json();
    },
    enabled: !!id,
  });

  // Real-time: listen for new replies on this poll
  useEffect(() => {
    if (!socket) return;
    const handler = (data: unknown) => {
      const reply = data as { pollId: string; reply: PollReply };
      if (reply.pollId === id) {
        queryClient.invalidateQueries({ queryKey: ["poll", id] });
        queryClient.invalidateQueries({ queryKey: ["polls"] });
        toast(`${reply.reply.sellerName} replied to your request!`, "info");
      }
    };
    socket.on("poll_reply", handler);
    return () => socket.off("poll_reply", handler);
  }, [socket, id, queryClient, toast]);

  return query;
}
