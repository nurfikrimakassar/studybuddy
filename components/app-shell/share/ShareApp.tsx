"use client";

import { useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import AchievementCard from "./AchievementCard";
import { CARD_TEMPLATES } from "./templates";

type Summary = { streakDays: number; minutesToday: number; sessionsToday: number };

function formatHoursMinutes(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} menit`;
  if (m === 0) return `${h} jam`;
  return `${h} jam ${m} menit`;
}

async function captureCardBlob(node: HTMLElement, backgroundColor: string): Promise<Blob> {
  const blob = await toBlob(node, { pixelRatio: 2, backgroundColor });
  if (!blob) throw new Error("Gagal render kartu jadi gambar.");
  return blob;
}

export default function ShareApp() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [templateId, setTemplateId] = useState(CARD_TEMPLATES[0].id);
  const storyExportRef = useRef<HTMLDivElement>(null);
  const compactExportRef = useRef<HTMLDivElement>(null);

  const template = CARD_TEMPLATES.find((t) => t.id === templateId) ?? CARD_TEMPLATES[0];

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
    if (!storyExportRef.current) return;
    setBusy(true);
    try {
      const blob = await captureCardBlob(storyExportRef.current, "#1E1B33");
      const file = new File([blob], "studybuddy-progress.png", { type: "image/png" });
      const text = summary
        ? `${formatHoursMinutes(summary.minutesToday)} fokus hari ini, ${summary.streakDays} hari beruntun di StudyBuddy!`
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
    if (!compactExportRef.current) return;
    setBusy(true);
    try {
      const blob = await captureCardBlob(compactExportRef.current, template.cardBackground === "#fff" ? "#fff" : template.cardBackground);
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

      <AchievementCard template={template} variant="preview" focusText={focusText} streakText={streakText} sessionsText={sessionsText} />

      <div style={{ background: "#fff", border: "1px solid #EAE6F6", borderRadius: 18, padding: "16px 20px" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1E1B33", marginBottom: 12 }}>Pilih Template</div>
        <div style={{ display: "flex", gap: 10 }}>
          {CARD_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplateId(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 100,
                fontSize: "0.82rem",
                fontWeight: 700,
                background: templateId === t.id ? "#F3F1FA" : "transparent",
                border: templateId === t.id ? "1.5px solid #DDD6F3" : "1.5px solid #EAE6F6",
                color: "#514C6B",
              }}
            >
              <span style={{ width: 16, height: 16, borderRadius: "50%", background: t.swatch, border: t.id === "minimal" ? "1px solid #DDD6F3" : "none", flexShrink: 0 }} />
              {t.name}
            </button>
          ))}
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

      {/* Versi compact buat di-download di desktop — dirender di luar layar. */}
      <div style={{ position: "fixed", top: 0, left: -9999, pointerEvents: "none" }} aria-hidden>
        <AchievementCard ref={compactExportRef} template={template} variant="compact" focusText={focusText} streakText={streakText} sessionsText={sessionsText} />
      </div>

      {/* Versi 9:16 buat share ke Instagram Story (mobile) — dirender di luar layar. */}
      <div style={{ position: "fixed", top: 0, left: -9999, pointerEvents: "none" }} aria-hidden>
        <AchievementCard ref={storyExportRef} template={template} variant="story" focusText={focusText} streakText={streakText} sessionsText={sessionsText} />
      </div>
    </>
  );
}
