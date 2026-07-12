import Logo from "./Logo";

const linkStyle: React.CSSProperties = { fontSize: "0.88rem", color: "#B8AEDF" };

const columnTitleStyle: React.CSSProperties = {
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "#fff",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 16,
};

const columns = [
  {
    title: "Produk",
    links: [
      { label: "Site Blocker", href: "#" },
      { label: "Pomodoro Timer", href: "#" },
      { label: "Jadwal & Kalender", href: "#" },
      { label: "Flashcard & Quiz", href: "#" },
      { label: "PDF Summarizer", href: "#" },
    ],
  },
  {
    title: "Kontak",
    links: [
      { label: "hello@studybuddy.app", href: "mailto:hello@studybuddy.app" },
      { label: "Join Waitlist", href: "#waitlist" },
      { label: "Instagram", href: "#" },
      { label: "X (Twitter)", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Kebijakan Privasi", href: "#" },
      { label: "Syarat & Ketentuan", href: "#" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-screen-label="Footer" style={{ background: "#1E1B33", padding: "96px 20px 32px" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 56,
          paddingBottom: 36,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ maxWidth: 280, flex: "0 1 240px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Logo size={28} boxColor="#4B4090" glyphColor="#EFEBFB" radius={8} />
            <span style={{ fontWeight: 800, fontSize: "1rem", color: "#fff" }}>StudyBuddy</span>
          </div>
          <p style={{ fontSize: "0.88rem", color: "#8B85A8", lineHeight: 1.6, maxWidth: 260, margin: 0 }}>
            Membantu pelajar dan mahasiswa membangun sesi belajar yang fokus dan terstruktur.
          </p>
        </div>

        <div className="footer-nav" style={{ display: "flex", flexWrap: "wrap", gap: 56, marginLeft: "auto", flex: "0 1 580px", minWidth: 0 }}>
          {columns.map((col) => (
            <div key={col.title} style={{ minWidth: 140 }}>
              <div style={columnTitleStyle}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <a key={link.label} href={link.href} style={linkStyle}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 24, fontSize: "0.8rem", color: "#6B6588" }}>
        © {year} StudyBuddy.
      </div>
    </footer>
  );
}
