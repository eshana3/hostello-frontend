"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/SocketProvider";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Notification } from "@/types/notification";

export function useNotifications(page = 1) {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const query = useQuery<{ notifications: Notification[]; unreadCount: number; total: number }>({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const res = await fetch(`/api/notifications?page=${page}&limit=20`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: 60000,
  });

  // Real-time: listen for new notifications via socket
  useEffect(() => {
    if (!socket) return;
    const handler = (notif: unknown) => {
      const n = notif as Notification;
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Show sonner toast
      toast(n.title, { description: n.message, duration: 5000 });
    };
    socket.on("notification", handler);
    return () => socket.off("notification", handler);
  }, [socket, queryClient]);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH" });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markOneRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return { ...query, markAllRead, markOneRead };
}
