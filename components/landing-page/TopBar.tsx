import Logo from "./Logo";

const navLinks = [
  { label: "Pomodoro Timer", href: "/timer" },
  { label: "Jadwal & Kalender", href: "/jadwal" },
  { label: "Flashcard & Quiz", href: "#features" },
  { label: "PDF Summarizer", href: "#features" },
];

export default function TopBar() {
  return (
    <div
      data-screen-label="Top Bar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        maxWidth: 1280,
        margin: "0 auto",
        padding: "28px 20px 0",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Logo size={30} boxColor="#3A3170" glyphColor="#EFEBFB" radius={9} />
        <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
          StudyBuddy
        </span>
      </div>
      <nav className="top-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{ fontSize: "0.88rem", fontWeight: 600, color: "#514C6B" }}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <a
        href="/timer"
        style={{
          fontSize: "0.9rem",
          fontWeight: 700,
          color: "#fff",
          background: "#3A3170",
          padding: "10px 20px",
          borderRadius: 100,
        }}
      >
        Buka Aplikasi
      </a>
    </div>
  );
}
