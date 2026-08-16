import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/currentUser";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default async function JadwalPage() {
  const user = await getCurrentUser();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF8FC",
        fontFamily: "var(--font-body)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #EAE6F6",
          borderRadius: 18,
          padding: "40px 36px",
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#514C6B",
            display: "inline-block",
            marginBottom: 24,
          }}
        >
          ← Kembali
        </Link>

        {user ? (
          <>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#4B4090",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              Terhubung ke Google Calendar
            </div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 6px", color: "#1E1B33" }}>
              Halo, {user.name}
            </h1>
            <p style={{ fontSize: "0.92rem", color: "#514C6B", margin: "0 0 24px" }}>{user.email}</p>
            <p style={{ fontSize: "0.82rem", color: "#9C97B5", margin: 0 }}>
              Sinkronisasi jadwal &amp; tugas ke Google Calendar masih dalam pengembangan, menyusul di
              tahap berikutnya.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 10px", color: "#1E1B33" }}>
              Jadwal &amp; Kalender
            </h1>
            <p style={{ fontSize: "0.92rem", color: "#514C6B", lineHeight: 1.6, margin: "0 0 24px" }}>
              Fitur ini sinkron langsung ke Google Calendar kamu, jadi perlu login pakai akun Google
              buat kasih izin akses kalender.
            </p>
            <GoogleSignInButton
              style={{
                display: "inline-block",
                background: "#3A3170",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              Login dengan Google
            </GoogleSignInButton>
          </>
        )}
      </div>
    </div>
  );
}
