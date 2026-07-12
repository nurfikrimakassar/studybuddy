"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";

type Role = "sma" | "mhs";

type WaitlistContextValue = {
  email: string;
  role: Role;
  submitted: boolean;
  setEmail: (value: string) => void;
  setRole: (value: Role) => void;
  submit: () => void;
};

const WaitlistContext = createContext<WaitlistContextValue | null>(null);

/**
 * Wraps the sections that contain a waitlist form (Hero + Final CTA) so a
 * single submission is reflected in both places at once, matching the
 * original single-state design comp.
 */
export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("mhs");
  const [submitted, setSubmitted] = useState(false);

  const value = useMemo(
    () => ({
      email,
      role,
      submitted,
      setEmail,
      setRole,
      submit: () => {
        if (email.trim()) {
          setSubmitted(true);
        }
      },
    }),
    [email, role, submitted]
  );

  return <WaitlistContext.Provider value={value}>{children}</WaitlistContext.Provider>;
}

export function useWaitlist() {
  const ctx = useContext(WaitlistContext);
  if (!ctx) {
    throw new Error("useWaitlist must be used within a WaitlistProvider");
  }
  return ctx;
}
