const steps = [
  {
    number: "01",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="6" width="16" height="14" rx="2" stroke="#fff" strokeWidth="2" />
        <path d="M4 10h16M8 4v4M16 4v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Atur jadwal & mata pelajaran",
    description: "Masukkan jadwal belajar dan tugasmu, otomatis tersinkron ke Google Calendar.",
  },
  {
    number: "02",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="9" rx="2" stroke="#fff" strokeWidth="2" />
        <path d="M8 11V7a4 4 0 018 0v4" stroke="#fff" strokeWidth="2" />
      </svg>
    ),
    title: "Aktifkan sesi fokus",
    description: "Situs distraksi otomatis terblokir selama sesi berlangsung, timer pomodoro berjalan.",
  },
  {
    number: "03",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <path d="M4 20V10M11 20V4M18 20v-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Pantau progres mingguan",
    description: "Lihat laporan jam fokus mingguan untuk mengevaluasi dan memperbaiki kebiasaan belajar.",
  },
];

export default function HowItWorks() {
  return (
    <section data-screen-label="How It Works" style={{ background: "#3A3170", padding: "96px 20px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div className="hiw-head" style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 56px" }}>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#B8AEDF",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            Cara Kerja
          </div>
          <h2
            style={{
              fontSize: "clamp(1.7rem,3vw,2.3rem)",
              fontWeight: 800,
              letterSpacing: "-0.015em",
              lineHeight: 1.25,
              margin: 0,
              color: "#fff",
            }}
          >
            Tiga langkah menuju sesi belajar yang lebih terkontrol.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 28 }}>
          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 18,
                padding: 32,
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#B8AEDF", marginBottom: 16 }}>
                {step.number}
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                {step.icon}
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#fff", marginBottom: 8 }}>
                {step.title}
              </div>
              <p style={{ fontSize: "0.9rem", color: "#CFC6EA", lineHeight: 1.6, margin: 0 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
