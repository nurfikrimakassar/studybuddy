"use client";

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";

const CACHE_KEY = "sb_session_ready_at";
// Sedikit lebih pendek dari umur cookie session (7 hari, lihat lib/auth/session.ts)
// supaya cache lokal ini nggak pernah "lebih percaya diri" dari cookie aslinya.
const CACHE_TTL_MS = 6 * 24 * 60 * 60 * 1000;

function hasFreshLocalSession() {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(CACHE_KEY);
  if (!raw) return false;
  const cachedAt = Number(raw);
  return Number.isFinite(cachedAt) && Date.now() - cachedAt < CACHE_TTL_MS;
}

function markLocalSessionReady() {
  window.localStorage.setItem(CACHE_KEY, String(Date.now()));
}

/**
 * Wraps the app shell's page content. Makes sure every visitor has a
 * Firebase identity (anonymous if they haven't signed in) and that our own
 * session cookie is set BEFORE rendering children — so Pomodoro/Blocker/etc
 * never fire their data calls while the cookie still doesn't exist yet.
 *
 * Three speed tiers, cheapest first:
 * 1. localStorage flag from a previous successful session — zero network
 *    calls, renders instantly. Trade-off: if the cookie was somehow
 *    invalidated server-side, that's only discovered when a feature's own
 *    API call 401s, not up front.
 * 2. GET /api/me — cheap local JWT verify + one indexed row lookup.
 * 3. Full Firebase verifyIdToken + Postgres upsert round trip (slowest,
 *    especially on a cold Neon compute) — only when 1 and 2 both miss.
 */
export default function EnsureSession({ children }: { children: ReactNode }) {
  // Selalu mulai dari false — walaupun localStorage bilang "fresh", nge-cek
  // window di initializer useState bikin hasil beda antara render server
  // (window belum ada) dan render client pertama (window ada), yang bikin
  // React hydration mismatch. Cache-nya tetap dicek, tapi di dalam
  // useEffect (jalan sesaat setelah hydration, bukan pas render).
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hasFreshLocalSession()) {
      setReady(true);
      return;
    }

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
          markLocalSessionReady();
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
          markLocalSessionReady();
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
