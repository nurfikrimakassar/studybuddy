import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/currentUser";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF8FC",
        fontFamily: "'Manrope', sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #EAE6F6",
          borderRadius: 18,
          padding: "40px 36px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
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
          Login berhasil
        </div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 6px", color: "#1E1B33" }}>
          Halo, {user.name}
        </h1>
        <p style={{ fontSize: "0.92rem", color: "#514C6B", margin: "0 0 24px" }}>{user.email}</p>
        <p style={{ fontSize: "0.82rem", color: "#9C97B5", margin: 0 }}>
          Halaman ini placeholder untuk membuktikan alur Google OAuth + session cookie jalan.
          Fitur jadwal, pomodoro, dan lainnya menyusul di tahap berikutnya.
        </p>
      </div>
    </div>
  );
}
