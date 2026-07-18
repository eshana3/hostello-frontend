"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

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
  currentUserId: "",
  currentUserName: "",
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<SocketLike | null>(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  // Keep a ref so the cleanup closure always has access to the latest socket instance,
  // even if the state setter is batched.
  const socketRef = useRef<SocketLike | null>(null);

  useEffect(() => {
    // Only connect once the user is authenticated
    if (!user?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    // Guard against the effect running again before the import resolves
    let cancelled = false;
    // Local var so the cleanup closure can call disconnect() even if state hasn't updated
    let s: SocketLike | null = null;

    import("socket.io-client")
      .then(({ io }) => {
        if (cancelled) return;

        const token = typeof window !== "undefined"
          ? localStorage.getItem("hm_auth_token")
          : null;

        const instance = io(SOCKET_URL, {
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          timeout: 5000,
          auth: { userId: user._id, token },
        });

        instance.on("connect", () => {
          setConnected(true);
          instance.emit("user_online", user._id);
        });

        instance.on("disconnect", () => setConnected(false));

        instance.on("user_online", (userId: unknown) => {
          setOnlineUsers(prev => new Set([...prev, userId as string]));
        });

        instance.on("user_offline", (userId: unknown) => {
          setOnlineUsers(prev => {
            const next = new Set(prev);
            next.delete(userId as string);
            return next;
          });
        });

        s = instance as unknown as SocketLike;
        socketRef.current = s;
        setSocket(s);
      })
      .catch(() => {
        // socket.io-client not installed — app works in offline/mock mode
        console.info("[Hostel Mart] Socket.io running in offline mode. Run: npm install socket.io-client");
      });

    // CRITICAL: this cleanup runs synchronously when the effect is torn down.
    // Returning a cleanup function from inside a Promise's .then() is silently
    // ignored by React — the cleanup MUST be returned directly from useEffect.
    return () => {
      cancelled = true;
      if (s) s.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]); // Re-run only when the authenticated user changes

  return (
    <SocketContext.Provider value={{
      socket,
      connected,
      onlineUsers,
      currentUserId: user?._id ?? "",
      currentUserName: user?.name ?? "",
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
