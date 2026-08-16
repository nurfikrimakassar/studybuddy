"use client";

import { CSSProperties, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  linkWithPopup,
  signInWithCredential,
  signInWithPopup,
  type AuthCredential,
} from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";

const resetStyle: CSSProperties = {
  border: "none",
  background: "none",
  font: "inherit",
  cursor: "pointer",
  textAlign: "inherit",
};

export default function GoogleSignInButton({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const auth = getClientAuth();
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/calendar");

      const currentUser = auth.currentUser;
      let idToken: string;

      if (currentUser?.isAnonymous) {
        // Upgrade sesi tamu (anonim) ke akun Google, sambil pertahankan uid
        // yang sama supaya histori (pomodoro/blocker) yang udah kesimpen
        // tetap nempel, bukan bikin akun baru dari nol.
        try {
          const result = await linkWithPopup(currentUser, provider);
          idToken = await result.user.getIdToken();
        } catch (err: unknown) {
          // Akun Google itu udah kepakai user lain sebelumnya (login dari
          // device/browser lain) — nggak bisa di-link, jadi pindah ke akun
          // yang sudah ada itu. Histori di sesi tamu ini otomatis ditinggal.
          const isCredentialInUse =
            typeof err === "object" && err !== null && "code" in err && err.code === "auth/credential-already-in-use";
          if (!isCredentialInUse) throw err;

          const credential = (err as { customData?: { updatedCredential?: AuthCredential } }).customData
            ?.updatedCredential;
          if (!credential) throw err;

          const result = await signInWithCredential(auth, credential);
          idToken = await result.user.getIdToken();
        }
      } else {
        const result = await signInWithPopup(auth, provider);
        idToken = await result.user.getIdToken();
      }

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error("Gagal bikin sesi login.");

      // Re-render server components (mis. cek cookie sesi) di halaman yang
      // sama tanpa full page reload, alih-alih redirect ke path tetap —
      // komponen ini dipasang di halaman manapun yang butuh gate login.
      router.refresh();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[auth] Google sign-in failed:", err);
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} style={{ ...resetStyle, ...style }}>
      {loading ? "Menghubungkan..." : children}
    </button>
  );
}
