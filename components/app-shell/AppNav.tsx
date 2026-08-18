"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/landing-page/Logo";
import {
  BlockerIcon,
  CalendarIcon,
  ExtensionIcon,
  FlashcardIcon,
  PomodoroIcon,
  ShareIcon,
  SummarizerIcon,
} from "./icons";

const navItems = [
  { href: "/app", label: "Pomodoro Timer", shortLabel: "Timer", Icon: PomodoroIcon },
  { href: "/app/jadwal", label: "Jadwal & Kalender", shortLabel: "Jadwal", Icon: CalendarIcon },
  { href: "/app/flashcard", label: "Flashcard & Quiz", shortLabel: "Kartu", Icon: FlashcardIcon },
  { href: "/app/summarizer", label: "PDF Summarizer", shortLabel: "PDF", Icon: SummarizerIcon },
  { href: "/app/blocker", label: "Site Blocker", shortLabel: "Blokir", Icon: BlockerIcon },
  { href: "/app/share", label: "Bagikan Progres", shortLabel: "Bagikan", Icon: ShareIcon },
];

// Nggak dimasukin ke bottom nav mobile (biar nggak sesak) — cukup diakses
// lewat sidebar desktop atau link dari halaman Site Blocker.
const secondaryNavItem = { href: "/app/extension", label: "Extension", Icon: ExtensionIcon };

export default function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <div
        className="app-sidebar"
        style={{
          width: 240,
          flexShrink: 0,
          background: "#fff",
          borderRight: "1px solid #EAE6F6",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px" }}>
          <Logo size={32} boxColor="#3A3170" glyphColor="#EFEBFB" radius={9} />
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "#1E1B33" }}>StudyBuddy</span>
        </Link>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(({ href, label, Icon }) => {
            const active = href === "/app" ? pathname === "/app" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 12px",
                  borderRadius: 10,
                  background: active ? "#F3F1FA" : "transparent",
                  color: active ? "#3A3170" : "#7A7593",
                }}
              >
                <Icon color={active ? "#3A3170" : "#7A7593"} />
                <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>{label}</span>
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: "auto", borderTop: "1px solid #EAE6F6", paddingTop: 12 }}>
          {(() => {
            const { href, label, Icon } = secondaryNavItem;
            const active = pathname.startsWith(href);
            return (
              <Link
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 12px",
                  borderRadius: 10,
                  background: active ? "#F3F1FA" : "transparent",
                  color: active ? "#3A3170" : "#7A7593",
                }}
              >
                <Icon color={active ? "#3A3170" : "#7A7593"} />
                <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>{label}</span>
              </Link>
            );
          })()}
        </div>
      </div>

      <div
        className="app-bottomnav"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          borderTop: "1px solid #EAE6F6",
          padding: "10px 8px calc(env(safe-area-inset-bottom, 0px) + 8px)",
          justifyContent: "space-around",
          zIndex: 10,
        }}
      >
        {navItems.map(({ href, shortLabel, Icon }) => {
          const active = href === "/app" ? pathname === "/app" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "4px 6px",
                flex: 1,
                color: active ? "#3A3170" : "#7A7593",
              }}
            >
              <Icon color={active ? "#3A3170" : "#7A7593"} />
              <span style={{ fontSize: "0.62rem", fontWeight: 700 }}>{shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
