const stats = [
  { value: "12.400+", label: "jam fokus tercatat oleh pengguna awal" },
  { value: "87%", label: "sesi fokus diselesaikan penuh oleh pengguna awal" },
  { value: "20+", label: "kampus & sekolah terwakili oleh pengguna awal" },
];

const testimonials = [
  {
    quote:
      "Sejak pakai StudyBuddy, saya jadi lebih sadar berapa banyak waktu yang sebenarnya hilang ke media sosial saat belajar.",
    name: "Nadia R.",
    role: "Mahasiswa Teknik · Pengguna Awal",
  },
  {
    quote:
      "Jadwalnya langsung nyambung ke Google Calendar saya, jadi nggak perlu atur dua kali. Simpel tapi kepakai.",
    name: "Bagas P.",
    role: "Siswa SMA, Kelas 12 · Pengguna Awal",
  },
  {
    quote: "Fitur pemblokir situsnya beneran ketat, nggak bisa saya matikan begitu saja saat lagi malas.",
    name: "Alya S.",
    role: "Mahasiswa Kedokteran · Pengguna Awal",
  },
];

export default function SocialProof() {
  return (
    <section data-screen-label="Social Proof" style={{ padding: "96px 20px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div
          className="sp-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 24,
            textAlign: "center",
            marginBottom: 64,
            paddingBottom: 56,
            borderBottom: "1px solid #EAE6F6",
          }}
        >
          {stats.map((stat) => (
            <div key={stat.value}>
              <div
                style={{
                  fontSize: "clamp(2rem,3.5vw,2.6rem)",
                  fontWeight: 800,
                  color: "#3A3170",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#7A7593", marginTop: 6 }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: "0.78rem", color: "#9C97B5", textAlign: "center", marginTop: -40, marginBottom: 56 }}>
          *Data preliminer dari pengguna awal StudyBuddy, akan diperbarui berkala.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {testimonials.map((t) => (
            <div key={t.name} style={{ background: "#F3F1FA", borderRadius: 18, padding: 32 }}>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#332E4D",
                  lineHeight: 1.7,
                  margin: "0 0 20px",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t.name}</div>
              <div style={{ fontSize: "0.82rem", color: "#7A7593" }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
