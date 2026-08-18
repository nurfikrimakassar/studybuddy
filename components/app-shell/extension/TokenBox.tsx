"use client";

import { useState } from "react";

export default function TokenBox({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API nggak tersedia (jarang) — user tinggal select manual
    }
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        readOnly
        value={token}
        onFocus={(e) => e.target.select()}
        style={{
          flex: 1,
          minWidth: 0,
          padding: "12px 14px",
          borderRadius: 10,
          border: "1.5px solid #EAE6F6",
          fontSize: "0.82rem",
          fontFamily: "monospace",
          background: "#FAF8FC",
          color: "#1E1B33",
        }}
      />
      <button
        type="button"
        onClick={copy}
        style={{
          background: copied ? "#4E6B4A" : "#3A3170",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.85rem",
          padding: "0 18px",
          borderRadius: 10,
          whiteSpace: "nowrap",
        }}
      >
        {copied ? "Tersalin!" : "Salin"}
      </button>
    </div>
  );
}
