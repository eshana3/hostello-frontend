"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CURRENT_USER_ID, CURRENT_USER_NAME } from "@/lib/mockChats";

// Minimal socket-like interface so the app works even without socket.io-client installed
interface SocketLike {
  connected: boolean;
  emit: (event: string, ...args: unknown[]) => void;
  on: (event: string, fn: (...args: unknown[]) => void) => void;
  off: (event: string, fn: (...args: unknown[]) => void) => void;
  disconnect: () => void;
}

interface SocketContextValue {
  socket: SocketLike | null;
  connected: boolean;
  onlineUsers: Set<string>;
  currentUserId: string;
  currentUserName: string;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
  onlineUsers: new Set(),
  currentUserId: CURRENT_USER_ID,
  currentUserName: CURRENT_USER_NAME,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<SocketLike | null>(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

    // Dynamically import socket.io-client so app doesn't crash if not installed
    import("socket.io-client")
      .then(({ io }) => {
        const s = io(SOCKET_URL, {
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          timeout: 5000,
          auth: {
            userId: CURRENT_USER_ID,
            userName: CURRENT_USER_NAME,
            // TODO: replace with real JWT token when auth is implemented
            // token: localStorage.getItem("auth_token"),
          },
        });

        s.on("connect", () => {
          setConnected(true);
          s.emit("user_online", CURRENT_USER_ID);
        });

        s.on("disconnect", () => setConnected(false));

        s.on("user_online", (userId: unknown) => {
          setOnlineUsers(prev => new Set([...prev, userId as string]));
        });

        s.on("user_offline", (userId: unknown) => {
          setOnlineUsers(prev => {
            const next = new Set(prev);
            next.delete(userId as string);
            return next;
          });
        });

        setSocket(s as unknown as SocketLike);

        return () => { s.disconnect(); };
      })
      .catch(() => {
        // socket.io-client not installed — app works in offline/mock mode
        console.info("[Hostello] Socket.io running in offline mode. Run: npm install socket.io-client");
      });
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, onlineUsers, currentUserId: CURRENT_USER_ID, currentUserName: CURRENT_USER_NAME }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
