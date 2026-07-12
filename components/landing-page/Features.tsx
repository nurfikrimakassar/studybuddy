import { ReactNode } from "react";

function FeatureCard({
  mockup,
  mockupBg,
  title,
  description,
}: {
  mockup: ReactNode;
  mockupBg: string;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #EAE6F6",
        borderRadius: 18,
        padding: 26,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: mockupBg,
          borderRadius: 12,
          marginBottom: 18,
          height: 172,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {mockup}
      </div>
      <div style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: 6 }}>{title}</div>
      <p style={{ fontSize: "0.9rem", color: "#514C6B", lineHeight: 1.55, margin: 0 }}>{description}</p>
    </div>
  );
}

function SiteBlockerMockup() {
  return (
    <div style={{ width: "100%", padding: 16 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5B5678" }} />
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5B5678" }} />
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5B5678" }} />
      </div>
      <div style={{ background: "#fff", borderRadius: 8, padding: 16, textAlign: "center" }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "#EFEBFB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="#4B4090" strokeWidth="2" />
            <path d="M8 11V7a4 4 0 018 0v4" stroke="#4B4090" strokeWidth="2" />
          </svg>
        </div>
        <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>Situs dijeda sementara</div>
        <div style={{ fontSize: "0.7rem", color: "#7A7593", marginTop: 4 }}>instagram.com · 23:41 tersisa</div>
      </div>
    </div>
  );
}

function PomodoroMockup() {
  return (
    <div
      style={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: "conic-gradient(#4B4090 0turn 0.4turn, #E4DEF6 0.4turn 1turn)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em" }}>15:04</div>
        <div style={{ fontSize: "0.6rem", color: "#9C97B5", fontWeight: 600 }}>Fokus</div>
      </div>
    </div>
  );
}

function CalendarMockup() {
  return (
    <div style={{ width: "100%", padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: "0.62rem",
          fontWeight: 700,
          color: "#4E6B4A",
          background: "#F1F6EF",
          borderRadius: 100,
          padding: "4px 8px",
          width: "fit-content",
          marginBottom: 10,
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6F8F6B" }} /> Sinkron Google
        Calendar
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{ height: 36, background: i === 2 ? "#3A3170" : "#EFEBFB", borderRadius: 6 }}
          />
        ))}
      </div>
    </div>
  );
}

function DocLines({ widths, color = "#DDD6F3" }: { widths: string[]; color?: string }) {
  return (
    <>
      {widths.map((w, i) => (
        <div
          key={i}
          style={{
            height: 3,
            width: w,
            background: color,
            borderRadius: 2,
            marginBottom: i === widths.length - 1 ? 0 : 4,
          }}
        />
      ))}
    </>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4 12h15M13 6l6 6-6 6" stroke="#9C97B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlashcardMockup() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #DDD6F3",
          borderRadius: 7,
          width: 44,
          height: 56,
          padding: 6,
          flexShrink: 0,
        }}
      >
        <DocLines widths={["70%", "100%", "85%", "60%"]} />
      </div>
      <ArrowIcon />
      <div style={{ position: "relative", width: 50, height: 56, flexShrink: 0 }}>
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            width: 46,
            height: 50,
            background: "#DDD6F3",
            borderRadius: 8,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 46,
            height: 50,
            background: "#4B4090",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 6,
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "0.5rem", color: "#fff", fontWeight: 700, lineHeight: 1.3 }}>
            Materi: Mitosis
          </span>
        </div>
      </div>
    </div>
  );
}

function PdfMockup() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #DDD6F3",
          borderRadius: 7,
          width: 44,
          height: 56,
          padding: 6,
          flexShrink: 0,
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            fontSize: "0.42rem",
            fontWeight: 800,
            color: "#9A5347",
            background: "#FBF2F0",
            borderRadius: 3,
            padding: "1px 3px",
          }}
        >
          PDF
        </span>
        <div style={{ marginTop: 10 }}>
          <DocLines widths={["80%", "100%", "90%", "65%"]} />
        </div>
      </div>
      <ArrowIcon />
      <div style={{ background: "#4B4090", borderRadius: 8, width: 50, height: 56, padding: 7, flexShrink: 0 }}>
        {["28px", "22px", "25px"].map((w, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: i === 2 ? 0 : 5 }}
          >
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#fff" }} />
            <div style={{ height: 2.5, width: w, background: "#B8AEDF", borderRadius: 2 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ShareCardMockup() {
  return (
    <div
      style={{
        width: 78,
        aspectRatio: "9/16",
        background: "linear-gradient(160deg,#3A3170,#1E1B33)",
        borderRadius: 12,
        padding: "10px 8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 12px 24px -10px rgba(30,27,51,0.4)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#F5A94E,#C24B8A,#5A4DA6)",
          }}
        />
        <span style={{ fontSize: "0.4rem", color: "#CFC6EA", fontWeight: 700 }}>StudyBuddy</span>
      </div>
      <div>
        <div style={{ fontSize: "0.6rem", color: "#fff", fontWeight: 800 }}>5 hari beruntun</div>
        <div style={{ fontSize: "0.5rem", color: "#CFC6EA", marginTop: 3 }}>2j 40m fokus hari ini</div>
        <div style={{ fontSize: "0.5rem", color: "#CFC6EA" }}>Kuis: 8/10 benar</div>
      </div>
    </div>
  );
}

const features = [
  {
    key: "site-blocker",
    mockup: <SiteBlockerMockup />,
    mockupBg: "#1E1B33",
    title: "Site Blocker",
    description: "Instagram, TikTok, YouTube, dan situs lain otomatis terkunci selama sesi fokus berlangsung.",
  },
  {
    key: "pomodoro",
    mockup: <PomodoroMockup />,
    mockupBg: "#F3F1FA",
    title: "Pomodoro Timer",
    description: "Sesi fokus dengan interval istirahat terstruktur, plus riwayat sesi untuk evaluasi mingguan.",
  },
  {
    key: "calendar",
    mockup: <CalendarMockup />,
    mockupBg: "#F3F1FA",
    title: "Jadwal Terintegrasi",
    description:
      "Jadwal mata pelajaran & tugas tersinkron otomatis ke Google Calendar, lengkap dengan to-do harian.",
  },
  {
    key: "flashcard",
    mockup: <FlashcardMockup />,
    mockupBg: "#F3F1FA",
    title: "Flashcard & Quiz Generator",
    description: "Upload materi atau catatan, sistem otomatis membuat flashcard dan kuis latihan untuk spaced repetition.",
  },
  {
    key: "pdf",
    mockup: <PdfMockup />,
    mockupBg: "#F3F1FA",
    title: "PDF Summarizer",
    description: "Upload dokumen materi kuliah, dapatkan ringkasan poin-poin penting secara otomatis.",
  },
  {
    key: "share",
    mockup: <ShareCardMockup />,
    mockupBg: "#F3F1FA",
    title: "Bagikan ke Instagram Story",
    description: "Selesai sesi belajar, StudyBuddy membuat kartu pencapaian yang siap dibagikan sebagai stiker story.",
  },
];

export default function Features() {
  return (
    <section data-screen-label="Features" style={{ padding: "96px 20px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div className="sec-head" style={{ maxWidth: 820, marginBottom: 48 }}>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#4B4090",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            Fitur Utama
          </div>
          <h2
            style={{
              fontSize: "clamp(1.7rem,3vw,2.3rem)",
              fontWeight: 800,
              letterSpacing: "-0.015em",
              lineHeight: 1.25,
              margin: "0 0 16px",
            }}
          >
            Semua yang kamu butuhkan untuk
            <br className="brk" />
            sesi belajar yang lebih baik.
          </h2>
          <p style={{ fontSize: "1.02rem", color: "#514C6B", lineHeight: 1.65, margin: 0 }}>
            Dari menjaga fokus, memahami materi, sampai merayakan progres, dalam satu tempat.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20 }}>
          {features.map((f) => (
            <FeatureCard
              key={f.key}
              mockup={f.mockup}
              mockupBg={f.mockupBg}
              title={f.title}
              description={f.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
