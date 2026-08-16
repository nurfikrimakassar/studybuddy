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
 * Two speed tiers, cheapest first:
 * 1. GET /api/me — cheap local JWT verify + one indexed row lookup.
 * 2. Full Firebase verifyIdToken + Postgres upsert round trip (slowest,
 *    especially on a cold Neon compute) — only when 1 misses.
 *
 * (No longer caches "ready" in localStorage — that made a broken session
 * look permanently fine after one failed handshake, since the fast path
 * would trust the stale flag instead of ever re-checking. Always verifying
 * against the server is slightly slower but never lies about the actual
 * cookie state.)
 */
export default function EnsureSession({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function establishFirebaseSession() {
      const auth = getClientAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (!user) {
            await signInAnonymously(auth);
            return; // onAuthStateChanged fires again once the anonymous user exists
          }

          const idToken = await user.getIdToken();
          const res = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
          if (!res.ok) {
            const body = await res.text().catch(() => "");
            throw new Error(`POST /api/auth/session gagal (${res.status}): ${body}`);
          }
          unsubscribe();
          if (!cancelled) setReady(true);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("[auth] Gagal sinkronkan session cookie:", err);
          unsubscribe();
          // Nggak ada sesi yang jalan, tapi tetap render halamannya —
          // lebih baik daripada macet selamanya di "Menyiapkan sesi...".
          // Fitur yang butuh data bakal gagal sendiri-sendiri dan itu
          // kelihatan di console, bukan bikin seluruh app nggak kebuka.
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
