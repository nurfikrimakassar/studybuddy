import { getCurrentUser } from "@/lib/auth/currentUser";
import { ensureApiToken } from "@/lib/usersRepo";
import TokenBox from "@/components/app-shell/extension/TokenBox";

const steps = [
  {
    title: "Download & pasang extension-nya",
    body: 'Buka chrome://extensions di browser, aktifkan "Developer mode" (pojok kanan atas), klik "Load unpacked", lalu pilih folder extension/ dari project StudyBuddy.',
  },
  {
    title: "Buka popup StudyBuddy di toolbar",
    body: 'Klik ikon StudyBuddy di toolbar Chrome (kalau nggak kelihatan, klik ikon puzzle 🧩 dulu terus pin). Bakal ada kolom buat paste token.',
  },
  {
    title: "Paste token di bawah ini",
    body: "Salin token di bawah, tempel ke extension, klik Hubungkan. Timer & Site Blocker di extension bakal langsung kepakai akun yang sama dengan web ini.",
  },
];

export default async function ExtensionPage() {
  const user = await getCurrentUser();
  const token = user ? await ensureApiToken(user.id) : null;

  return (
    <>
      <div>
        <div style={{ fontSize: "0.72rem", color: "#9C97B5", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
          Chrome Extension
        </div>
        <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1E1B33" }}>Hubungkan Extension</div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #EAE6F6", borderRadius: 18, padding: 22, display: "flex", flexDirection: "column", gap: 18 }}>
        {steps.map((step, i) => (
          <div key={step.title} style={{ display: "flex", gap: 14 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#F3F1FA",
                color: "#4B4090",
                fontWeight: 800,
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#1E1B33", marginBottom: 3 }}>{step.title}</div>
              <p style={{ fontSize: "0.85rem", color: "#514C6B", margin: 0, lineHeight: 1.6 }}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #EAE6F6", borderRadius: 18, padding: 22 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E1B33", marginBottom: 12 }}>Token Kamu</div>
        {token ? (
          <TokenBox token={token} />
        ) : (
          <p style={{ fontSize: "0.85rem", color: "#9C97B5", margin: 0 }}>Menyiapkan sesi... refresh halaman ini sebentar lagi.</p>
        )}
        <p style={{ fontSize: "0.78rem", color: "#9C97B5", margin: "12px 0 0", lineHeight: 1.6 }}>
          Jangan bagikan token ini ke siapa pun — siapa yang pegang token ini bisa akses data StudyBuddy kamu. Kalau
          kamu curiga token ini bocor, buka lagi extension-nya nanti buat regenerate.
        </p>
      </div>
    </>
  );
}
