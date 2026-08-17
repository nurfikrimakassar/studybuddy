import { forwardRef } from "react";
import type { CardTemplate } from "./templates";

type Variant = "preview" | "compact" | "story";

const VARIANT_CONFIG: Record<
  Variant,
  {
    width: number | string;
    height?: number;
    padding: string;
    heroFont: string;
    gridFont: string;
    labelFont: string;
    logoSize: number;
    nameFont: string;
    statLabelFont: string;
    statValueFont: string;
    gap: number;
  }
> = {
  preview: { width: "100%", padding: "22px 20px", heroFont: "2.2rem", gridFont: "1.5rem", labelFont: "0.68rem", logoSize: 26, nameFont: "0.72rem", statLabelFont: "0.6rem", statValueFont: "0.9rem", gap: 14 },
  compact: { width: 420, padding: "22px 20px", heroFont: "2.2rem", gridFont: "1.5rem", labelFont: "0.68rem", logoSize: 26, nameFont: "0.72rem", statLabelFont: "0.6rem", statValueFont: "0.9rem", gap: 14 },
  story: { width: 360, height: 640, padding: "36px 32px", heroFont: "4.2rem", gridFont: "2.2rem", labelFont: "0.8rem", logoSize: 30, nameFont: "1.05rem", statLabelFont: "0.72rem", statValueFont: "1.5rem", gap: 0 },
};

function FlameIcon({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2c1 3-3 4-3 8a3 3 0 006 0c1.5 1 2 2.8 2 4.5A5 5 0 0112 20a5 5 0 01-5-5c0-2.5 1.2-4 2-5.5C10 7.5 11 5 12 2z"
        fill={color}
      />
    </svg>
  );
}

function Logo({ size, bg, glyph }: { size: number; bg: string; glyph: string }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.53} height={size * 0.53} viewBox="0 0 24 24" fill="none">
        <rect x="3.8" y="4.6" width="6" height="14.8" rx="3" fill={glyph} />
        <rect x="14.2" y="4.6" width="6" height="14.8" rx="3" fill={glyph} />
        <rect x="8.6" y="7" width="6.8" height="2.8" rx="1.4" fill={glyph} />
      </svg>
    </div>
  );
}

function Decoration({ template }: { template: CardTemplate }) {
  if (template.decoration === "watermark") {
    return (
      <div
        style={{
          position: "absolute",
          right: -30,
          bottom: -30,
          width: 200,
          height: 200,
          opacity: 0.07,
          transform: "rotate(-18deg)",
          pointerEvents: "none",
        }}
      >
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none">
          <rect x="3.8" y="4.6" width="6" height="14.8" rx="3" fill="#fff" />
          <rect x="14.2" y="4.6" width="6" height="14.8" rx="3" fill="#fff" />
          <rect x="8.6" y="7" width="6.8" height="2.8" rx="1.4" fill="#fff" />
        </svg>
      </div>
    );
  }
  if (template.decoration === "dots") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1.5px, transparent 1.5px)",
          backgroundSize: "18px 18px",
          pointerEvents: "none",
        }}
      />
    );
  }
  return null;
}

type Props = {
  template: CardTemplate;
  variant: Variant;
  focusText: string;
  streakText: string;
  sessionsText: string;
};

const AchievementCard = forwardRef<HTMLDivElement, Props>(function AchievementCard(
  { template, variant, focusText, streakText, sessionsText },
  ref
) {
  const cfg = VARIANT_CONFIG[variant];
  const isStory = variant === "story";
  const heroText = template.heroStat === "streak" ? streakText : focusText;
  const heroLabel = template.heroStat === "streak" ? "Streak belajar" : "Fokus hari ini";
  const subStats =
    template.heroStat === "streak"
      ? [
          { label: "Fokus hari ini", value: focusText },
          { label: "Sesi Pomodoro", value: sessionsText },
        ]
      : [
          { label: "Streak", value: streakText },
          { label: "Sesi Pomodoro", value: sessionsText },
        ];

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        width: cfg.width,
        height: cfg.height,
        maxWidth: variant === "preview" ? 420 : undefined,
        margin: variant === "preview" ? "0 auto" : undefined,
        background: isStory ? template.storyBackground : template.cardBackground,
        border: template.border,
        borderRadius: isStory ? 0 : 18,
        padding: cfg.padding,
        display: "flex",
        flexDirection: "column",
        justifyContent: isStory ? "space-between" : undefined,
        gap: cfg.gap || undefined,
        fontFamily: "var(--font-body)",
      }}
    >
      <Decoration template={template} />

      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: template.logoAlign === "right" ? "flex-end" : "flex-start", gap: 10 }}>
        <Logo size={cfg.logoSize} bg={template.logoBg} glyph={template.logoGlyph} />
        <span style={{ fontWeight: 800, fontSize: cfg.nameFont, color: template.textColor, letterSpacing: "-0.01em" }}>
          StudyBuddy
        </span>
      </div>

      {template.layout === "grid" ? (
        // Minimal: 3 kolom setara, nggak ada 1 angka besar yang "dipentingin" —
        // beda struktur dari 2 template lain, bukan cuma beda warna.
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: isStory ? 20 : 12, flex: isStory ? 1 : undefined, justifyContent: isStory ? "center" : undefined }}>
          <div style={{ fontSize: cfg.labelFont, fontWeight: 700, color: template.labelColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Progres Hari Ini
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isStory ? 16 : 10 }}>
            {[
              { label: "Fokus", value: focusText },
              { label: "Streak", value: streakText },
              { label: "Sesi", value: sessionsText },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "#F3F1FA", borderRadius: 12, padding: isStory ? "18px 10px" : "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: cfg.statValueFont, fontWeight: 800, color: template.textColor, marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: cfg.statLabelFont, color: template.subTextColor, fontWeight: 600 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: cfg.labelFont, fontWeight: 700, color: template.labelColor, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: isStory ? 10 : 4 }}>
              {heroLabel}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: isStory ? 12 : 6 }}>
              {template.heroStat === "streak" && <FlameIcon color={template.textColor} size={isStory ? 44 : 24} />}
              <div style={{ fontSize: cfg.heroFont, fontWeight: 800, color: template.textColor, lineHeight: 1, letterSpacing: "-0.02em" }}>
                {heroText}
              </div>
            </div>
          </div>

          <div style={{ position: "relative", display: "flex", gap: isStory ? 16 : 8, borderTop: `1px solid ${template.dividerColor}`, paddingTop: isStory ? 24 : 14 }}>
            {subStats.map((stat, i) => (
              <div
                key={stat.label}
                style={{ flex: 1, textAlign: isStory ? "left" : "center", borderLeft: !isStory && i > 0 ? `1px solid ${template.dividerColor}` : undefined }}
              >
                <div style={{ fontSize: cfg.statLabelFont, color: template.subTextColor, fontWeight: 600, marginBottom: isStory ? 6 : 3 }}>{stat.label}</div>
                <div style={{ fontSize: cfg.statValueFont, fontWeight: 800, color: template.textColor }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

export default AchievementCard;
