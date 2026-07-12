const stats = [
  {
    value: "2.5 jam",
    description:
      "rata-rata waktu yang dilaporkan hilang tiap hari akibat notifikasi media sosial saat sesi belajar berlangsung.",
  },
  {
    value: "61%",
    description: "pelajar mengaku tidak punya jadwal belajar tertulis yang konsisten diikuti tiap minggu.",
  },
  {
    value: "4x",
    description: "rata-rata gangguan per jam saat belajar tanpa sistem pemblokir maupun batas waktu sesi.",
  },
];

export default function Problem() {
  return (
    <section data-screen-label="Problem" style={{ background: "#F3F1FA", padding: "96px 20px" }}>
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
            Masalahnya
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
            Waktu belajar makin panjang, tapi hasilnya belum tentu makin baik.
          </h2>
          <p style={{ fontSize: "1.02rem", color: "#514C6B", lineHeight: 1.65, margin: 0 }}>
            Distraksi digital dan jadwal yang tidak terstruktur membuat banyak jam belajar berakhir tidak
            <br className="brk" />
            efektif, bukan karena kurang niat, tapi karena tidak ada sistem yang menjaga fokus.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
          {stats.map((stat) => (
            <div
              key={stat.value}
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: "44px 32px",
                border: "1px solid #EAE6F6",
                minHeight: 250,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <div style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#3A3170" }}>
                {stat.value}
              </div>
              <p style={{ fontSize: "0.95rem", color: "#514C6B", lineHeight: 1.6, margin: "22px 0 0" }}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>
        <div style={{ fontSize: "0.78rem", color: "#9C97B5", marginTop: 16 }}>
          *Ilustrasi berdasarkan riset kebiasaan digital pelajar secara umum, disederhanakan untuk konteks
          StudyBuddy.
        </div>
      </div>
    </section>
  );
}
