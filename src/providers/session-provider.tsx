"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authClient } from "@/lib/auth-client";

export type SessionUser = typeof authClient.$Infer.Session.user;

type SessionValue = {
  user: SessionUser | null;
  isPending: boolean;
  setUser: (user: SessionUser | null) => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    let cancelled = false;

    authClient
      .getSession()
      .then(({ data }) => {
        if (cancelled) {
          return;
        }

        setUser(data?.user ?? null);
        setIsPending(false);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setUser(null);
        setIsPending(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ user, isPending, setUser }),
    [user, isPending],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSessionUser() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSessionUser must be used within SessionProvider");
  }

  return context;
}
