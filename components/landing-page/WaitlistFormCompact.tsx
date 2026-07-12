"use client";

import { FormEvent } from "react";
import { useWaitlist } from "./WaitlistContext";

export default function WaitlistFormCompact() {
  const { email, submitted, setEmail, submit } = useWaitlist();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  if (submitted) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "#F1F6EF",
          border: "1.5px solid #CFE0C9",
          borderRadius: 100,
          padding: "12px 22px",
          fontWeight: 700,
          fontSize: "0.9rem",
          color: "#4E6B4A",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12.5L9.5 18L20 6"
            stroke="#4E6B4A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Sudah masuk daftar tunggu
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}
    >
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
    </form>
  );
}
