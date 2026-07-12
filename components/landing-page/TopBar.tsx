import Logo from "./Logo";

export default function TopBar() {
  return (
    <div
      data-screen-label="Top Bar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1280,
        margin: "0 auto",
        padding: "32px 20px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Logo size={30} boxColor="#3A3170" glyphColor="#EFEBFB" radius={9} />
        <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
          StudyBuddy
        </span>
      </div>
      <a
        href="#waitlist"
        style={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#3A3170",
          padding: "9px 18px",
          border: "1.5px solid #DDD6F3",
          borderRadius: 100,
        }}
      >
        Join Waitlist
      </a>
    </div>
  );
}
