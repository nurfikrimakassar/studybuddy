import Link from "next/link";
import PomodoroTimer from "@/components/timer/PomodoroTimer";

export default function TimerPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF8FC",
        fontFamily: "var(--font-body)",
        padding: "40px 20px 80px",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Link
          href="/"
          style={{ fontSize: "0.85rem", fontWeight: 600, color: "#514C6B", display: "inline-block", marginBottom: 32 }}
        >
          ← Kembali
        </Link>
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            letterSpacing: "-0.015em",
            margin: "0 0 8px",
            textAlign: "center",
          }}
        >
          Pomodoro Timer
        </h1>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#514C6B",
            textAlign: "center",
            margin: "0 0 32px",
          }}
        >
          25 menit fokus, 5 menit istirahat. Nggak perlu login buat pakai ini.
        </p>
        <PomodoroTimer />
      </div>
    </div>
  );
}
