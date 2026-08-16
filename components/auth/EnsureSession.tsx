"use client";

import { useEffect } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";

/**
 * Mounted once in the app shell. Makes sure every visitor has a Firebase
 * identity (anonymous if they haven't signed in) and that our own session
 * cookie matches it, so Pomodoro/Blocker history persists from the very
 * first visit — no login prompt needed until a feature actually requires
 * a real Google account (Jadwal & Kalender).
 */
export default function EnsureSession() {
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
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
