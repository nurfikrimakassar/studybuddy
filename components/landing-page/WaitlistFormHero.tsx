"use client";

import { FormEvent } from "react";
import { useWaitlist } from "./WaitlistContext";

const toggleBtnBase: React.CSSProperties = {
  border: "none",
  borderRadius: 100,
  padding: "7px 14px",
  fontSize: "0.8rem",
  fontWeight: 700,
  cursor: "pointer",
};

export default function WaitlistFormHero() {
  const { email, role, submitted, setEmail, setRole, submit } = useWaitlist();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  if (submitted) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#F1F6EF",
          border: "1.5px solid #CFE0C9",
          borderRadius: 14,
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "#6F8F6B",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12.5L9.5 18L20 6"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
            Kamu sudah masuk daftar tunggu
          </div>
          <div style={{ fontSize: "0.85rem", color: "#5B6B57" }}>
            Kami akan mengabari begitu akses awal dibuka.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          type="email"
          required
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: 1,
            minWidth: 220,
            padding: "14px 16px",
            borderRadius: 12,
            border: "1.5px solid #DDD6F3",
            fontSize: "0.95rem",
            fontFamily: "var(--font-body)",
            background: "#fff",
            color: "#1E1B33",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#3A3170",
            color: "#fff",
            border: "none",
            padding: "14px 24px",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Join Waitlist
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 2 }}>
        <span style={{ fontSize: "0.82rem", color: "#7A7593", fontWeight: 600 }}>
          Saya adalah:
        </span>
        <div style={{ display: "flex", gap: 6, background: "#F1EFF9", borderRadius: 100, padding: 3 }}>
          <button
            type="button"
            onClick={() => setRole("sma")}
            style={{
              ...toggleBtnBase,
              background: role === "sma" ? "#3A3170" : "transparent",
              color: role === "sma" ? "#fff" : "#7A7593",
            }}
          >
            Siswa SMA
          </button>
          <button
            type="button"
            onClick={() => setRole("mhs")}
            style={{
              ...toggleBtnBase,
              background: role === "mhs" ? "#3A3170" : "transparent",
              color: role === "mhs" ? "#fff" : "#7A7593",
            }}
          >
            Mahasiswa
          </button>
        </div>
      </div>
    </form>
  );
}
