"use client";

import { useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";

type Summary = { streakDays: number; minutesToday: number; sessionsToday: number };

function formatHoursMinutes(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}j ${m}m`;
}

// Dimensi tetap khusus buat elemen yang di-export jadi gambar (rasio 9:16,
// pas buat Instagram Story) — terpisah dari kartu yang ditampilkan di
// halaman, yang ukurannya tetap compact kayak sebelumnya.
const EXPORT_WIDTH = 360;
const EXPORT_HEIGHT = 640;

async function captureCardBlob(node: HTMLElement): Promise<Blob> {
  const blob = await toBlob(node, { pixelRatio: 2, backgroundColor: "#1E1B33" });
  if (!blob) throw new Error("Gagal render kartu jadi gambar.");
  return blob;
}

export default function ShareApp() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

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

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 4000);
  }

  async function shareCard() {
    if (!exportRef.current) return;
    setBusy(true);
    try {
      const blob = await captureCardBlob(exportRef.current);
      const file = new File([blob], "studybuddy-progress.png", { type: "image/png" });
      const text = summary
        ? `${summary.streakDays} hari beruntun, ${formatHoursMinutes(summary.minutesToday)} fokus hari ini di StudyBuddy!`
        : "Progres belajar StudyBuddy!";

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Progres Belajar StudyBuddy", text });
        showToast("Kartu dibagikan.");
      } else if (navigator.share) {
        // Browser ini bisa share tapi nggak dukung file — teks doang,
        // Instagram Story kemungkinan nggak muncul di daftar (butuh gambar).
        await navigator.share({ title: "Progres Belajar StudyBuddy", text });
        showToast("Kartu dibagikan (tanpa gambar — browser ini belum dukung share gambar).");
      } else {
        showToast("Share nggak didukung di browser ini.");
      }
    } catch (err) {
      const isAbort = err instanceof DOMException && err.name === "AbortError";
      if (!isAbort) {
        // eslint-disable-next-line no-console
        console.error("[share] Gagal bagikan kartu:", err);
        showToast("Gagal bikin/bagikan kartu — coba lagi.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function downloadCard() {
    if (!exportRef.current) return;
    setBusy(true);
    try {
      const blob = await captureCardBlob(exportRef.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "studybuddy-progress.png";
      a.click();
      URL.revokeObjectURL(url);
      showToast("Kartu berhasil diunduh.");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[share] Gagal unduh kartu:", err);
      showToast("Gagal bikin gambar kartu — coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  const streakText = summary ? `${summary.streakDays} hari` : "...";
  const focusText = summary ? formatHoursMinutes(summary.minutesToday) : "...";
  const sessionsText = summary ? String(summary.sessionsToday) : "...";

  return (
    <>
      <div>
        <div style={{ fontSize: "0.72rem", color: "#9C97B5", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
          Bagikan Progres
        </div>
        <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1E1B33" }}>Kartu Pencapaian Hari Ini</div>
      </div>

      {/* Kartu yang ditampilkan di halaman — ukuran compact, cuma buat preview */}
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
        <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{streakText}</div>
        <div style={{ display: "flex", gap: 8, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 14 }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "0.62rem", color: "#CFC6EA", fontWeight: 600, marginBottom: 3 }}>Jam fokus</div>
            <div style={{ fontSize: "0.98rem", fontWeight: 800, color: "#fff" }}>{focusText}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ fontSize: "0.62rem", color: "#CFC6EA", fontWeight: 600, marginBottom: 3 }}>Sesi Pomodoro</div>
            <div style={{ fontSize: "0.98rem", fontWeight: 800, color: "#fff" }}>{sessionsText}</div>
          </div>
        </div>
      </div>

      {isMobile ? (
        <button
          type="button"
          onClick={shareCard}
          disabled={busy}
          style={{ background: "#3A3170", color: "#fff", fontWeight: 700, fontSize: "0.92rem", padding: 14, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          {busy ? "Nyiapin kartu..." : "Bagikan ke Instagram Story"}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={downloadCard}
            disabled={busy}
            style={{ background: "#3A3170", color: "#fff", fontWeight: 700, fontSize: "0.92rem", padding: 14, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {busy ? "Nyiapin kartu..." : "Download Kartu"}
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

      {/* Versi 9:16 buat di-export jadi gambar — dirender di luar layar,
          nggak keliatan, cuma dipakai html-to-image buat capture. */}
      <div style={{ position: "fixed", top: 0, left: -9999, pointerEvents: "none" }} aria-hidden>
        <div
          ref={exportRef}
          style={{
            width: EXPORT_WIDTH,
            height: EXPORT_HEIGHT,
            background: "linear-gradient(160deg, #3A3170, #1E1B33)",
            padding: "36px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily: "var(--font-body)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3.8" y="4.6" width="6" height="14.8" rx="3" fill="#fff" />
                <rect x="14.2" y="4.6" width="6" height="14.8" rx="3" fill="#fff" />
                <rect x="8.6" y="7" width="6.8" height="2.8" rx="1.4" fill="#fff" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#fff", letterSpacing: "-0.01em" }}>StudyBuddy</span>
          </div>

          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#B8AEDF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              Streak belajar
            </div>
            <div style={{ fontSize: "4.2rem", fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>{streakText}</div>
          </div>

          <div style={{ display: "flex", gap: 16, borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.72rem", color: "#CFC6EA", fontWeight: 600, marginBottom: 6 }}>Jam fokus</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>{focusText}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.72rem", color: "#CFC6EA", fontWeight: 600, marginBottom: 6 }}>Sesi Pomodoro</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>{sessionsText}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
