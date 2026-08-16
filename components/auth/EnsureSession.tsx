"use client";

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";

/**
 * Wraps the app shell's page content. Makes sure every visitor has a
 * Firebase identity (anonymous if they haven't signed in) and that our own
 * session cookie is set BEFORE rendering children — so Pomodoro/Blocker/etc
 * never fire their data calls while the cookie still doesn't exist yet
 * (that race made completed sessions silently fail to save). No login
 * prompt needed until a feature actually requires a real Google account
 * (Jadwal & Kalender).
 */
export default function EnsureSession({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = getClientAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
        return; // onAuthStateChanged fires again once the anonymous user exists
      }

      try {
        const idToken = await user.getIdToken();
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[auth] Gagal sinkronkan session cookie:", err);
      } finally {
        setReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!ready) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, color: "#9C97B5", fontSize: "0.88rem" }}>
        Menyiapkan sesi...
      </div>
    );
  }

  return <>{children}</>;
}
