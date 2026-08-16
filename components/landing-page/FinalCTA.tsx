export default function FinalCTA() {
  return (
    <section data-screen-label="Final CTA" style={{ padding: "40px 20px 96px", textAlign: "center" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div style={{ background: "#fff", border: "1px solid #EAE6F6", borderRadius: 24, padding: "64px 40px" }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem,3.2vw,2.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              margin: "0 0 14px",
            }}
          >
            Bangun kebiasaan belajar yang lebih fokus,
            <br className="brk" />
            <em
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 500,
                color: "#4B4090",
              }}
            >
              mulai dari sesi berikutnya.
            </em>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#514C6B",
              margin: "0 0 32px",
              maxWidth: 580,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Daftar untuk mendapat akses awal saat StudyBuddy resmi dirilis.
            <br className="brk" />
            Tidak ada komitmen, cukup email kamu.
          </p>
          <div style={{ maxWidth: 440, margin: "0 auto" }}>
            <a
              href="/app"
              style={{
                display: "inline-block",
                background: "#3A3170",
                color: "#fff",
                padding: "15px 32px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              Coba Aplikasi
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
