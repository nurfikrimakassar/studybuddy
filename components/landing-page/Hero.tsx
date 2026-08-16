import WaitlistFormHero from "./WaitlistFormHero";

const blockedSites = ["Instagram", "TikTok", "YouTube"];

function BlockedSitePill({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: "0.78rem",
        fontWeight: 600,
        background: "#FBF2F0",
        color: "#9A5347",
        borderRadius: 100,
        padding: "6px 11px",
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="9" rx="2" stroke="#9A5347" strokeWidth="2" />
        <path d="M8 11V7a4 4 0 018 0v4" stroke="#9A5347" strokeWidth="2" />
      </svg>
      {label}
    </span>
  );
}

export default function Hero() {
  return (
    <section data-screen-label="Hero" style={{ padding: "88px 20px 112px" }}>
      <div
        className="hero-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: 56,
          alignItems: "stretch",
        }}
      >
        <div
          className="hero-left"
          style={{ display: "flex", flexDirection: "column", gap: 56, flex: "1 1 420px", minWidth: 0 }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(2.6rem, 5vw, 4.2rem)",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                margin: "0 0 22px",
              }}
            >
              Study sessions built for{" "}
              <em
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#4B4090",
                }}
              >
                focus
              </em>
              , and progress you understand.
            </h1>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#514C6B", maxWidth: 540, margin: 0 }}>
              StudyBuddy membantu kamu belajar lebih fokus dan lebih efektif, dari menjaga fokus, memahami
              materi, sampai merayakan progres yang bisa kamu pamerkan.
            </p>
          </div>

          <div id="waitlist" style={{ maxWidth: 420 }}>
            <WaitlistFormHero />
          </div>
        </div>

        {/* Hero mockup: focus session dashboard */}
        <div className="hero-mockup" style={{ display: "flex", justifyContent: "flex-end", flex: "1 1 420px", minWidth: 0 }}>
          <div
            className="hero-card"
            style={{
              width: "100%",
              maxWidth: "clamp(340px, 34vw, 468px)",
              height: "100%",
              background: "#fff",
              borderRadius: 22,
              boxShadow: "0 30px 60px -20px rgba(58,49,112,0.25)",
              border: "1px solid #EDE9F7",
              padding: 24,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#9C97B5",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Sesi Hari Ini
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700, marginTop: 2 }}>Kalkulus II</div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#F1F6EF",
                  color: "#4E6B4A",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "5px 10px",
                  borderRadius: 100,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6F8F6B" }} />
                Sedang fokus
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", margin: "30px 0 28px" }}>
              <div
                style={{
                  width: 236,
                  height: 236,
                  borderRadius: "50%",
                  background: "conic-gradient(#4B4090 0turn 0.62turn, #EFEBFB 0.62turn 1turn)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 196,
                    height: 196,
                    borderRadius: "50%",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>24:12</div>
                  <div style={{ fontSize: "0.72rem", color: "#9C97B5", fontWeight: 600 }}>Fokus · Ronde 2/4</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#9C97B5",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 8,
                }}
              >
                Diblokir sekarang
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {blockedSites.map((site) => (
                  <BlockedSitePill key={site} label={site} />
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: 18,
                paddingTop: 16,
                borderTop: "1px solid #F1EFF9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "0.82rem", color: "#514C6B" }}>Istirahat berikutnya</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>10:45 · 5 mnt</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
