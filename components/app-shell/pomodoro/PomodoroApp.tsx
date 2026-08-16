"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

type Mode = "focus" | "short" | "long";

const PRESETS = [
  { label: "25/5", focus: 25, short: 5, long: 15 },
  { label: "50/10", focus: 50, short: 10, long: 20 },
  { label: "15/3", focus: 15, short: 3, long: 10 },
];

const inputStyle: React.CSSProperties = {
  width: 64,
  padding: "8px 10px",
  borderRadius: 8,
  border: "1.5px solid #EAE6F6",
  fontSize: "0.85rem",
  fontFamily: "var(--font-body)",
  textAlign: "center",
};

function durationFor(mode: Mode, focusMin: number, shortMin: number, longMin: number) {
  if (mode === "focus") return focusMin * 60;
  if (mode === "short") return shortMin * 60;
  return longMin * 60;
}

function celebrate() {
  confetti({
    particleCount: 120,
    spread: 80,
    startVelocity: 45,
    origin: { y: 0.6 },
    colors: ["#4B4090", "#3A3170", "#6F8F6B", "#B8AEDF"],
  });
}

async function logSession(durationMinutes: number): Promise<boolean> {
  try {
    const res = await fetch("/api/pomodoro/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durationMinutes, completed: true }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      // eslint-disable-next-line no-console
      console.error(`[pomodoro] Gagal simpan sesi (${res.status}): ${body}`);
      return false;
    }
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[pomodoro] Gagal simpan sesi:", err);
    return false;
  }
}

export default function PomodoroApp() {
  const [preset, setPreset] = useState("25/5");
  const [focusMin, setFocusMin] = useState(25);
  const [shortMin, setShortMin] = useState(5);
  const [longMin, setLongMin] = useState(15);

  const [customOpen, setCustomOpen] = useState(false);
  const [customFocus, setCustomFocus] = useState("25");
  const [customShort, setCustomShort] = useState("5");
  const [customLong, setCustomLong] = useState("15");
  const [customSessions, setCustomSessions] = useState("4");

  // Berapa sesi fokus ditarget sebelum timer berhenti sendiri, bukan muter
  // terus tanpa akhir. 0 berarti nggak dibatasi (muter terus kayak sebelumnya).
  const [totalSessions, setTotalSessions] = useState(4);
  const [completedSessions, setCompletedSessions] = useState(0);

  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<Mode>("focus");
  const [round, setRound] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(focusMin * 60);

  const [sessionsToday, setSessionsToday] = useState(0);
  const [minutesToday, setMinutesToday] = useState(0);
  const [blockedDomains, setBlockedDomains] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayInfo, setOverlayInfo] = useState({ sessions: 0, minutes: 0 });

  const stateRef = useRef({ mode, round, focusMin, shortMin, longMin, totalSessions, completedSessions });
  stateRef.current = { mode, round, focusMin, shortMin, longMin, totalSessions, completedSessions };

  // Waktu (timestamp asli, bukan hitungan detik) saat fase berjalan ini
  // seharusnya berakhir. Timer dihitung dari selisih ke waktu ini, bukan
  // dari decrement per-tick — supaya tetap akurat walau tab di-background
  // dan browser nge-throttle/nge-pause setInterval-nya.
  const endAtRef = useRef<number | null>(null);

  // Dipakai debugFastForward: begitu sesi debug ini kelar, timer berhenti
  // (bukan lanjut ke istirahat otomatis) supaya jelas kelihatan "sesi ini
  // udah selesai", bukan keliatan jalan terus tanpa henti.
  const pauseAfterNextRef = useRef(false);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 4000);
  }

  function refreshStats() {
    fetch("/api/stats/summary")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setSessionsToday(data.sessionsToday);
          setMinutesToday(data.minutesToday);
        }
      })
      .catch(() => {});
  }

  useEffect(() => {
    refreshStats();
    fetch("/api/blocked-sites")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setBlockedDomains(data.domains))
      .catch(() => {});
  }, []);

  function advance() {
    const s = stateRef.current;
    if (s.mode === "focus") {
      const newCompleted = s.completedSessions + 1;
      const debugPause = pauseAfterNextRef.current;
      // 0 = nggak dibatasi, muter terus. Kalau ditarget, berhenti sendiri
      // begitu jumlah sesi fokus tercapai — nggak nyambung ke istirahat lagi.
      const targetReached = !debugPause && s.totalSessions > 0 && newCompleted >= s.totalSessions;
      // Confetti + kartu "selesai" cuma pas 1 SET beneran kelar (atau lagi
      // nge-tes pakai tombol debug) — bukan tiap 1 sesi fokus doang.
      const isSetComplete = debugPause || targetReached;

      if (isSetComplete) {
        celebrate();
        setOverlayInfo({ sessions: debugPause ? 1 : s.totalSessions, minutes: (debugPause ? 1 : s.totalSessions) * s.focusMin });
        setShowOverlay(true);
      }

      logSession(s.focusMin).then((ok) => {
        if (!isSetComplete) {
          showToast(ok ? `✅ Sesi tersimpan (${s.focusMin} menit fokus)` : "⚠️ Gagal simpan sesi — cek Console buat detailnya");
        } else if (!ok) {
          showToast("⚠️ Sesi terakhir gagal tersimpan — cek Console buat detailnya");
        }
        if (ok) refreshStats();
      });

      const nextMode: Mode = s.round % 4 === 0 ? "long" : "short";
      const nextSeconds = durationFor(nextMode, s.focusMin, s.shortMin, s.longMin);

      if (debugPause) {
        pauseAfterNextRef.current = false;
        endAtRef.current = null;
        setMode(nextMode);
        setSecondsLeft(nextSeconds);
        setRunning(false);
        setCompletedSessions(newCompleted);
      } else if (targetReached) {
        endAtRef.current = null;
        setRunning(false);
        setMode("focus");
        setRound(1);
        setSecondsLeft(s.focusMin * 60);
        setCompletedSessions(0);
      } else {
        endAtRef.current = Date.now() + nextSeconds * 1000;
        setMode(nextMode);
        setSecondsLeft(nextSeconds);
        setCompletedSessions(newCompleted);
      }
    } else {
      const nextRound = s.mode === "long" ? 1 : s.round + 1;
      const nextSeconds = durationFor("focus", s.focusMin, s.shortMin, s.longMin);
      endAtRef.current = Date.now() + nextSeconds * 1000;
      setRound(nextRound);
      setMode("focus");
      setSecondsLeft(nextSeconds);
    }
  }

  // Baca ulang sisa waktu dari endAtRef (bukan decrement manual). Dipanggil
  // dari interval tiap detik DAN dari event visibilitychange, supaya begitu
  // balik ke tab ini timer langsung nyusul ke angka yang benar, bukan
  // nunggu tick berikutnya.
  function syncFromClock() {
    if (endAtRef.current === null) return;
    const remaining = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
    setSecondsLeft(remaining);
    if (remaining <= 0) advance();
  }

  useEffect(() => {
    if (!running) return;

    const id = setInterval(syncFromClock, 1000);
    document.addEventListener("visibilitychange", syncFromClock);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", syncFromClock);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function toggleRun() {
    setRunning((r) => {
      const next = !r;
      if (next) {
        endAtRef.current = Date.now() + secondsLeft * 1000;
      } else {
        endAtRef.current = null;
      }
      return next;
    });
  }

  function reset() {
    pauseAfterNextRef.current = false;
    setRunning(false);
    endAtRef.current = null;
    setMode("focus");
    setRound(1);
    setCompletedSessions(0);
    setSecondsLeft(focusMin * 60);
  }

  function skip() {
    advance();
  }

  // Debug only: percepat sesi saat ini jadi 5 detik lagi. Begitu sesi itu
  // kelar, timer otomatis berhenti (bukan lanjut ke istirahat) supaya
  // kelihatan jelas "sesi ini udah selesai & tersimpan" lewat toast,
  // tanpa perlu nunggu 25 menit asli atau bingung dia masih jalan atau kagak.
  function debugFastForward() {
    pauseAfterNextRef.current = true;
    endAtRef.current = Date.now() + 5000;
    setSecondsLeft(5);
    setRunning(true);
  }

  function applyDurations(label: string, focus: number, short: number, long: number, sessions: number) {
    pauseAfterNextRef.current = false;
    setPreset(label);
    setFocusMin(focus);
    setShortMin(short);
    setLongMin(long);
    setTotalSessions(sessions);
    setRunning(false);
    endAtRef.current = null;
    setMode("focus");
    setRound(1);
    setCompletedSessions(0);
    setSecondsLeft(focus * 60);
  }

  function applyPreset(p: (typeof PRESETS)[number]) {
    setCustomOpen(false);
    applyDurations(p.label, p.focus, p.short, p.long, 4);
  }

  function applyCustom() {
    const focus = Math.max(1, Math.round(Number(customFocus)) || 25);
    const short = Math.max(1, Math.round(Number(customShort)) || 5);
    const long = Math.max(1, Math.round(Number(customLong)) || 15);
    const parsedSessions = Math.round(Number(customSessions));
    // 0 = sengaja nggak dibatasi (muter terus), bukan nilai kosong yang gagal parse.
    const sessions = Number.isFinite(parsedSessions) ? Math.max(0, parsedSessions) : 4;
    applyDurations("Custom", focus, short, long, sessions);
  }

  const total = durationFor(mode, focusMin, shortMin, longMin);
  const progress = 1 - secondsLeft / total;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const ringColor = mode === "focus" ? "#4B4090" : "#6F8F6B";
  const modeLabel = mode === "focus" ? "Fokus" : mode === "short" ? "Istirahat" : "Istirahat Panjang";
  const sessionLabel =
    totalSessions > 0
      ? `Sesi ${Math.min(completedSessions + (mode === "focus" ? 1 : 0), totalSessions)}/${totalSessions}`
      : `Ronde ${round}/4`;

  const dots: { width: number; active: boolean }[] = [];
  for (let i = 1; i <= 4; i++) {
    const isCurrent = i === round && mode === "focus";
    const isPast = i < round || (i === round && mode !== "focus");
    dots.push({ width: 16, active: isPast || isCurrent });
    if (i < 4) dots.push({ width: 5, active: false });
  }

  return (
    <>
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(30,27,51,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 22,
              padding: "40px 32px",
              maxWidth: 360,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 30px 60px -20px rgba(30,27,51,0.4)",
            }}
          >
            <div style={{ fontSize: "2.6rem", marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E1B33", marginBottom: 8 }}>
              Yey! Sesi kamu udah selesai
            </div>
            <p style={{ fontSize: "0.92rem", color: "#514C6B", margin: "0 0 24px" }}>
              {overlayInfo.sessions} sesi fokus · {overlayInfo.minutes} menit total. Mantap!
            </p>
            <button
              type="button"
              onClick={() => setShowOverlay(false)}
              style={{ background: "#3A3170", color: "#fff", fontWeight: 700, fontSize: "0.9rem", padding: "12px 28px", borderRadius: 12 }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "0.72rem", color: "#9C97B5", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
            Sesi hari ini
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1E1B33" }}>Pomodoro Timer</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: running ? "#F1F6EF" : "#F3F1FA",
            padding: "6px 12px",
            borderRadius: 100,
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: running ? "#6F8F6B" : "#9C97B5" }} />
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: running ? "#4E6B4A" : "#7A7593" }}>
            {running ? "Sedang fokus" : "Dijeda"}
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EAE6F6",
          borderRadius: 22,
          padding: "40px 24px",
          boxShadow: "0 30px 60px -30px rgba(58,49,112,0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "min(260px, 60vw)",
            height: "min(260px, 60vw)",
            borderRadius: "50%",
            background: `conic-gradient(${ringColor} ${progress}turn, #E4DEF6 ${progress}turn 1turn)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: "84%",
              height: "84%",
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "clamp(2.2rem, 8vw, 3.4rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#1E1B33" }}>
              {mm}:{ss}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#9C97B5", fontWeight: 600, marginTop: 4 }}>
              {modeLabel} · {sessionLabel}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
          {dots.map((dot, i) => (
            <div key={i} style={{ width: dot.width, height: 6, borderRadius: 3, background: dot.active ? "#4B4090" : "#DCD5F0" }} />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset"
            style={{ width: 48, height: 48, borderRadius: "50%", background: "#F3F1FA", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B4090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleRun}
            aria-label={running ? "Jeda" : "Mulai"}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#3A3170",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 24px -8px rgba(58,49,112,0.5)",
            }}
          >
            {running ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 3 }}>
                <path d="M7 4l14 8-14 8z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={skip}
            aria-label="Lewati"
            style={{ width: 48, height: 48, borderRadius: "50%", background: "#F3F1FA", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B4090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EAE6F6",
          borderRadius: 18,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1E1B33" }}>Preset interval</div>
          <div style={{ display: "flex", gap: 8 }}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 100,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  background: preset === p.label ? "#3A3170" : "#F3F1FA",
                  color: preset === p.label ? "#fff" : "#514C6B",
                }}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCustomOpen((o) => !o)}
              style={{
                padding: "8px 14px",
                borderRadius: 100,
                fontSize: "0.82rem",
                fontWeight: 700,
                background: preset === "Custom" ? "#3A3170" : "#F3F1FA",
                color: preset === "Custom" ? "#fff" : "#514C6B",
              }}
            >
              Custom
            </button>
          </div>
        </div>

        {customOpen && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap", borderTop: "1px solid #F1EFF9", paddingTop: 16 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: "0.72rem", color: "#9C97B5", fontWeight: 600 }}>Fokus (menit)</span>
              <input type="number" min={1} value={customFocus} onChange={(e) => setCustomFocus(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: "0.72rem", color: "#9C97B5", fontWeight: 600 }}>Istirahat pendek</span>
              <input type="number" min={1} value={customShort} onChange={(e) => setCustomShort(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: "0.72rem", color: "#9C97B5", fontWeight: 600 }}>Istirahat panjang</span>
              <input type="number" min={1} value={customLong} onChange={(e) => setCustomLong(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: "0.72rem", color: "#9C97B5", fontWeight: 600 }}>Jumlah sesi (0 = terus)</span>
              <input type="number" min={0} value={customSessions} onChange={(e) => setCustomSessions(e.target.value)} style={inputStyle} />
            </label>
            <button
              type="button"
              onClick={applyCustom}
              style={{ background: "#3A3170", color: "#fff", fontWeight: 700, fontSize: "0.82rem", padding: "9px 16px", borderRadius: 10 }}
            >
              Terapkan
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={debugFastForward}
        style={{
          alignSelf: "center",
          fontSize: "0.76rem",
          fontWeight: 700,
          color: "#9A5347",
          background: "#FBF2F0",
          padding: "8px 14px",
          borderRadius: 100,
          border: "1px dashed #F3DCD6",
        }}
      >
        🐞 Debug: selesaikan sesi 5 detik lagi
      </button>

      {toast && (
        <div
          style={{
            background: toast.startsWith("✅") ? "#F1F6EF" : "#FBF2F0",
            border: `1.5px solid ${toast.startsWith("✅") ? "#CFE0C9" : "#F3DCD6"}`,
            borderRadius: 12,
            padding: "12px 16px",
            textAlign: "center",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: toast.startsWith("✅") ? "#4E6B4A" : "#9A5347",
          }}
        >
          {toast}
        </div>
      )}

      {running && blockedDomains.length > 0 && (
        <div style={{ background: "#FBF2F0", border: "1px solid #F3DCD6", borderRadius: 16, padding: "18px 22px" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9A5347", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
            Diblokir sekarang
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {blockedDomains.map((domain) => (
              <div key={domain} style={{ background: "#fff", padding: "6px 12px", borderRadius: 100, fontSize: "0.82rem", fontWeight: 600, color: "#9A5347" }}>
                {domain}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          background: "#3A3170",
          borderRadius: 18,
          padding: "22px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: "0.72rem", color: "#B8AEDF", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
            Hari ini
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff" }}>
            {sessionsToday} sesi · {minutesToday} menit fokus
          </div>
        </div>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#CFC6EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
    </>
  );
}
