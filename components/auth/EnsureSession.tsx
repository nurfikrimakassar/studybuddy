"use client";

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";

/**
 * Wraps the app shell's page content. Makes sure every visitor has a
 * Firebase identity (anonymous if they haven't signed in) and that our own
 * session cookie is set BEFORE rendering children — so Pomodoro/Blocker/etc
 * never fire their data calls while the cookie still doesn't exist yet.
 *
 * Checks the existing cookie via GET /api/me first — that's a cheap local
 * JWT verify + one indexed row lookup. Only falls back to the full Firebase
 * verifyIdToken + Postgres upsert round trip (slower, especially on a cold
 * Neon compute) when there's no valid session yet.
 */
export default function EnsureSession({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function establishFirebaseSession() {
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
          unsubscribe();
          if (!cancelled) setReady(true);
        }
      });
    }

    fetch("/api/me")
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          setReady(true);
        } else {
          establishFirebaseSession();
        }
      })
      .catch(() => {
        if (!cancelled) establishFirebaseSession();
      });

    return () => {
      cancelled = true;
    };
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
