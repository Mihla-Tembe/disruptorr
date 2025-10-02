"use client";

import * as React from "react";
import { getProfileAction } from "@/actions/profile";

type AuthStatus = "loading" | "guest" | "member";

type AuthContextValue = {
  status: AuthStatus;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  refresh: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const mountedRef = React.useRef(true);
  const [status, setStatus] = React.useState<AuthStatus>("loading");
  const [profile, setProfile] =
    React.useState<AuthContextValue["profile"]>(null);

  const refresh = React.useCallback(async () => {
    try {
      const result = await getProfileAction();
      if (!mountedRef.current) return;
      if (result.ok) {
        setStatus("member");
        setProfile(result.profile);
      } else {
        setStatus("guest");
        setProfile(null);
      }
    } catch {
      if (!mountedRef.current) return;
      setStatus("guest");
      setProfile(null);
    }
  }, []);

  React.useEffect(() => {
    mountedRef.current = true;
    refresh();
    return () => {
      mountedRef.current = false;
    };
  }, [refresh]);

  const value = React.useMemo<AuthContextValue>(
    () => ({ status, profile, refresh }),
    [status, profile, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
