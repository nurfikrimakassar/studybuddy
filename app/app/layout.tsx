import EnsureSession from "@/components/auth/EnsureSession";
import AppNav from "@/components/app-shell/AppNav";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "var(--font-body)" }}>
      <EnsureSession />
      <AppNav />
      <div className="app-main" style={{ flex: 1, minWidth: 0, padding: "40px 24px 40px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
