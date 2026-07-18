"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AuthUser {
  _id?: string;
  email: string;
  name: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  hostel?: any;
  avatar?: string;
  token?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

const STORAGE_KEY = "hm_auth_user";
const TOKEN_KEY   = "hm_auth_token";

function normalizeHostel(h: any): string {
  return h && typeof h === "object" ? (h.name ?? "") : (h ?? "");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setIsLoading(false);
      return;
    }

    // ── Optimistic load ──────────────────────────────────────────────
    // Show the cached user immediately so the app renders without a
    // loading flash. The token is validated in the background below.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const cached = JSON.parse(stored) as AuthUser;
        cached.hostel = normalizeHostel(cached.hostel);
        setUser(cached);
        setIsLoading(false); // ← app visible instantly for returning users
      }
    } catch {}

    // ── Background token validation ──────────────────────────────────
    // Silent: only mutates state if the server says something changed.
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          const raw = data.user as AuthUser;
          raw.hostel = normalizeHostel(raw.hostel);
          const u: AuthUser = { ...raw, token };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
          setUser(u);
        } else {
          // Token is truly invalid / revoked — sign out
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
        }
      })
      .catch(() => {
        // Network error: already showing cached user — nothing to do
      })
      .finally(() => {
        // Ensure loading is cleared even if cache was empty
        setIsLoading(false);
      });
  }, []);

  const login = (u: AuthUser) => {
    const normalized: AuthUser = {
      ...u,
      hostel: normalizeHostel(u.hostel),
    };
    if (normalized.token) localStorage.setItem(TOKEN_KEY, normalized.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    setUser(normalized);
  };

  const logout = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Fire-and-forget: increment tokenVersion on server
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};
