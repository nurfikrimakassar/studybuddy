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

function FlameIcon({ size }: { size: number }) {
  return <span style={{ fontSize: size, lineHeight: 1 }}>🔥</span>;
}

function Logo({ size, bg, glyph, square }: { size: number; bg: string; glyph: string; square?: boolean }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: square ? 4 : size * 0.28,
        border: square ? `2px solid ${glyph}` : undefined,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.53} height={size * 0.53} viewBox="0 0 24 24" fill="none">
        <rect x="3.8" y="4.6" width="6" height="14.8" rx={square ? 0 : 3} fill={glyph} />
        <rect x="14.2" y="4.6" width="6" height="14.8" rx={square ? 0 : 3} fill={glyph} />
        <rect x="8.6" y="7" width="6.8" height="2.8" rx={square ? 0 : 1.4} fill={glyph} />
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
          bottom: -55,
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
          backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
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
  const isPreview = variant === "preview";
  // box-shadow yang nongol di luar batas kotak card bisa kepotong pas
  // di-capture jadi gambar (html-to-image motong persis di batas node-nya) —
  // kasih bungkus tipis transparan di sekelilingnya buat ruang aman.
  const hasHardShadow = template.cardStyle === "brutal" && !isStory;
  const safePad = hasHardShadow ? 10 : 0;
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

  const cardNode = (
    <div
      ref={isPreview ? ref : undefined}
      style={{
        position: "relative",
        overflow: "hidden",
        width: cfg.width,
        height: cfg.height,
        maxWidth: variant === "preview" ? 420 : undefined,
        margin: variant === "preview" ? "0 auto" : undefined,
        background: isStory ? template.storyBackground : template.cardBackground,
        border: template.border,
        borderRadius: isStory || template.cardStyle === "brutal" ? 0 : 18,
        boxShadow: template.cardStyle === "brutal" && !isStory ? "8px 8px 0 #1E1B33" : undefined,
        padding: cfg.padding,
        display: "flex",
        flexDirection: "column",
        justifyContent: isStory ? "space-between" : undefined,
        gap: cfg.gap || undefined,
        fontFamily: "var(--font-body)",
      }}
    >
      <Decoration template={template} />

      {template.layout === "grid" && (
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: template.logoAlign === "right" ? "flex-end" : "flex-start", gap: 10 }}>
          <Logo size={cfg.logoSize} bg={template.logoBg} glyph={template.logoGlyph} square={template.cardStyle === "brutal"} />
          <span style={{ fontWeight: 800, fontSize: cfg.nameFont, color: template.textColor, letterSpacing: "-0.01em" }}>
            StudyBuddy
          </span>
        </div>
      )}

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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: isStory ? 10 : 4 }}>
              <div style={{ fontSize: cfg.labelFont, fontWeight: 700, color: template.labelColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {heroLabel}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Logo size={cfg.logoSize} bg={template.logoBg} glyph={template.logoGlyph} square={template.cardStyle === "brutal"} />
                <span style={{ fontWeight: 800, fontSize: cfg.nameFont, color: template.textColor, letterSpacing: "-0.01em" }}>
                  StudyBuddy
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: isStory ? 12 : 6 }}>
              {template.heroStat === "streak" && <FlameIcon size={isStory ? 44 : 24} />}
              <div style={{ fontSize: cfg.heroFont, fontWeight: 800, color: template.textColor, lineHeight: 1, letterSpacing: "-0.02em" }}>
                {heroText}
              </div>
            </div>
          </div>

          {template.cardStyle === "brutal" ? (
            // Brutal: tiap stat jadi kotak sendiri dengan border, bukan
            // dipisah garis tipis — chunky, sesuai gaya neobrutalism.
            <div style={{ position: "relative", display: "flex", gap: isStory ? 14 : 8 }}>
              {subStats.map((stat) => (
                <div
                  key={stat.label}
                  style={{ flex: 1, textAlign: "center", border: `2px solid ${template.dividerColor}`, borderRadius: 0, padding: isStory ? "14px 8px" : "8px 6px" }}
                >
                  <div style={{ fontSize: cfg.statLabelFont, color: template.subTextColor, fontWeight: 700, marginBottom: isStory ? 6 : 3, textTransform: "uppercase" }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: cfg.statValueFont, fontWeight: 800, color: template.textColor }}>{stat.value}</div>
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </>
      )}
    </div>
  );

  if (isPreview) return cardNode;

  return (
    <div ref={ref} style={{ display: "inline-block", padding: safePad }}>
      {cardNode}
    </div>
  );
});

export default AchievementCard;
