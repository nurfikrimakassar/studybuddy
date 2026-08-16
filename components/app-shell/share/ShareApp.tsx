"use client";

import { useEffect, useState } from "react";

type Summary = { streakDays: number; minutesToday: number; sessionsToday: number };

function formatHoursMinutes(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}j ${m}m`;
}

export default function ShareApp() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/stats/summary")
      .then((r) => (r.ok ? r.json() : null))
      .then(setSummary)
      .catch(() => {});

    const check = () => setIsMobile(window.innerWidth <= 760);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  async function shareCard() {
    const text = summary
      ? `${summary.streakDays} hari beruntun, ${formatHoursMinutes(summary.minutesToday)} fokus hari ini di StudyBuddy!`
      : "Progres belajar StudyBuddy!";

    if (navigator.share) {
      try {
        await navigator.share({ title: "Progres Belajar StudyBuddy", text });
        setToast("Kartu dibagikan.");
      } catch {
        // user membatalkan share sheet, nggak perlu ditampilkan sebagai error
      }
    } else {
      setToast("Bagikan tidak didukung di browser ini. Coba dari aplikasi Instagram.");
    }
    setTimeout(() => setToast(""), 3000);
  }

  function downloadCard() {
    setToast("Unduh kartu belum tersedia — coba buka StudyBuddy di HP untuk membagikan langsung ke Instagram Story.");
    setTimeout(() => setToast(""), 4000);
  }

  return (
    <>
      <div>
        <div style={{ fontSize: "0.72rem", color: "#9C97B5", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
          Bagikan Progres
        </div>
        <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1E1B33" }}>Kartu Pencapaian Hari Ini</div>
      </div>

      <div
        style={{
          background: "#3A3170",
          borderRadius: 18,
          padding: "22px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          maxWidth: 420,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#B8AEDF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Streak belajar
          </div>
          <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#fff" }}>StudyBuddy</span>
        </div>
        <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
          {summary ? `${summary.streakDays} hari` : "..."}
        </div>
        <div style={{ display: "flex", gap: 8, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 14 }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "0.62rem", color: "#CFC6EA", fontWeight: 600, marginBottom: 3 }}>Jam fokus</div>
            <div style={{ fontSize: "0.98rem", fontWeight: 800, color: "#fff" }}>
              {summary ? formatHoursMinutes(summary.minutesToday) : "..."}
            </div>
          </div>
          <div style={{ flex: 1, textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ fontSize: "0.62rem", color: "#CFC6EA", fontWeight: 600, marginBottom: 3 }}>Sesi Pomodoro</div>
            <div style={{ fontSize: "0.98rem", fontWeight: 800, color: "#fff" }}>{summary ? summary.sessionsToday : "..."}</div>
          </div>
        </div>
      </div>

      {isMobile ? (
        <button
          type="button"
          onClick={shareCard}
          style={{ background: "#3A3170", color: "#fff", fontWeight: 700, fontSize: "0.92rem", padding: 14, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          Bagikan ke Instagram Story
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={downloadCard}
            style={{ background: "#3A3170", color: "#fff", fontWeight: 700, fontSize: "0.92rem", padding: 14, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            Download Kartu
          </button>
          <p style={{ fontSize: "0.82rem", color: "#9C97B5", textAlign: "center", margin: 0 }}>
            Berbagi langsung ke Instagram Story hanya tersedia dari aplikasi di HP. Buka StudyBuddy di HP untuk
            membagikan langsung, atau unduh kartu ini dan unggah manual sebagai stiker.
          </p>
        </>
      )}

      {toast && (
        <div style={{ background: "#F1F6EF", border: "1.5px solid #CFE0C9", borderRadius: 12, padding: "12px 16px", textAlign: "center", fontSize: "0.85rem", fontWeight: 700, color: "#4E6B4A" }}>
          {toast}
        </div>
      )}
    </>
  );
}
