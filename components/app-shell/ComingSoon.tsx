export default function ComingSoon({ label, note }: { label: string; note: string }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #EAE6F6",
        borderRadius: 18,
        padding: "56px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F3F1FA", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B4090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        </svg>
      </div>
      <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#1E1B33" }}>{label}</div>
      <p style={{ fontSize: "0.9rem", color: "#9C97B5", margin: 0, maxWidth: 320 }}>{note}</p>
    </div>
  );
}
