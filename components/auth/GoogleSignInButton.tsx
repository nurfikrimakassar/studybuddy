"use client";

import { CSSProperties, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/calendar");
      const result = await signInWithPopup(getClientAuth(), provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error("Gagal bikin sesi login.");

      router.push("/dashboard");
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
