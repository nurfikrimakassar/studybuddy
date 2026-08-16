"use client";

import { useEffect, useRef, useState } from "react";

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

type Mode = "focus" | "break";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Sesi selesai: pindah mode & set durasi berikutnya.
        setMode((prevMode) => {
          const nextMode: Mode = prevMode === "focus" ? "break" : "focus";
          if (nextMode === "focus") setRound((r) => r + 1);
          return nextMode;
        });
        return 0;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // Begitu secondsLeft nyentuh 0 (sesi abis), langsung isi ulang durasi mode baru.
  useEffect(() => {
    if (secondsLeft === 0) {
      setSecondsLeft((mode === "focus" ? FOCUS_MINUTES : BREAK_MINUTES) * 60);
    }
  }, [mode, secondsLeft]);

  function toggleRunning() {
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setMode("focus");
    setRound(1);
    setSecondsLeft(FOCUS_MINUTES * 60);
  }

  const totalSeconds = (mode === "focus" ? FOCUS_MINUTES : BREAK_MINUTES) * 60;
  const progress = 1 - secondsLeft / totalSeconds;

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "0 auto",
        background: "#fff",
        border: "1px solid #EAE6F6",
        borderRadius: 22,
        padding: "40px 32px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "0.78rem",
          fontWeight: 700,
          color: mode === "focus" ? "#4B4090" : "#4E6B4A",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 24,
        }}
      >
        {mode === "focus" ? "Sesi Fokus" : "Istirahat"} · Ronde {round}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `conic-gradient(${mode === "focus" ? "#4B4090" : "#6F8F6B"} ${progress}turn, #EFEBFB ${progress}turn 1turn)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {formatTime(secondsLeft)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          type="button"
          onClick={toggleRunning}
          style={{
            border: "none",
            background: "#3A3170",
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          {running ? "Jeda" : secondsLeft === totalSeconds ? "Mulai" : "Lanjut"}
        </button>
        <button
          type="button"
          onClick={reset}
          style={{
            border: "1.5px solid #DDD6F3",
            background: "none",
            color: "#3A3170",
            padding: "14px 24px",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
