import { forwardRef } from "react";
import type { CardTemplate } from "./templates";

type Variant = "preview" | "compact" | "story";

const VARIANT_CONFIG: Record<Variant, { width: number | string; height?: number; padding: string; bigFont: string; labelFont: string; logoSize: number; nameFont: string; statLabelFont: string; statValueFont: string; gap: number }> = {
  preview: { width: "100%", padding: "22px 20px", bigFont: "2.2rem", labelFont: "0.68rem", logoSize: 0, nameFont: "0.72rem", statLabelFont: "0.62rem", statValueFont: "0.98rem", gap: 14 },
  compact: { width: 420, padding: "22px 20px", bigFont: "2.2rem", labelFont: "0.68rem", logoSize: 0, nameFont: "0.72rem", statLabelFont: "0.62rem", statValueFont: "0.98rem", gap: 14 },
  story: { width: 360, height: 640, padding: "36px 32px", bigFont: "4.2rem", labelFont: "0.8rem", logoSize: 30, nameFont: "1.05rem", statLabelFont: "0.72rem", statValueFont: "1.5rem", gap: 0 },
};

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

  return (
    <div
      ref={ref}
      style={{
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        {cfg.logoSize > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: cfg.logoSize,
                height: cfg.logoSize,
                borderRadius: 9,
                background: template.logoBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width={cfg.logoSize * 0.53} height={cfg.logoSize * 0.53} viewBox="0 0 24 24" fill="none">
                <rect x="3.8" y="4.6" width="6" height="14.8" rx="3" fill={template.logoGlyph} />
                <rect x="14.2" y="4.6" width="6" height="14.8" rx="3" fill={template.logoGlyph} />
                <rect x="8.6" y="7" width="6.8" height="2.8" rx="1.4" fill={template.logoGlyph} />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: cfg.nameFont, color: template.textColor, letterSpacing: "-0.01em" }}>
              StudyBuddy
            </span>
          </div>
        ) : (
          <div style={{ fontSize: cfg.labelFont, fontWeight: 700, color: template.labelColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Fokus hari ini
          </div>
        )}
        {cfg.logoSize === 0 && (
          <span style={{ fontSize: cfg.nameFont, fontWeight: 800, color: template.textColor }}>StudyBuddy</span>
        )}
      </div>

      <div style={isStory ? {} : { marginTop: 0 }}>
        {isStory && (
          <div style={{ fontSize: cfg.labelFont, fontWeight: 700, color: template.labelColor, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Fokus hari ini
          </div>
        )}
        <div style={{ fontSize: cfg.bigFont, fontWeight: 800, color: template.textColor, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {focusText}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: isStory ? 16 : 8,
          borderTop: `1px solid ${template.dividerColor}`,
          paddingTop: isStory ? 24 : 14,
        }}
      >
        <div style={{ flex: 1, textAlign: isStory ? "left" : "center" }}>
          <div style={{ fontSize: cfg.statLabelFont, color: template.subTextColor, fontWeight: 600, marginBottom: isStory ? 6 : 3 }}>Streak</div>
          <div style={{ fontSize: cfg.statValueFont, fontWeight: 800, color: template.textColor }}>{streakText}</div>
        </div>
        <div style={{ flex: 1, textAlign: isStory ? "left" : "center", borderLeft: isStory ? undefined : `1px solid ${template.dividerColor}` }}>
          <div style={{ fontSize: cfg.statLabelFont, color: template.subTextColor, fontWeight: 600, marginBottom: isStory ? 6 : 3 }}>Sesi Pomodoro</div>
          <div style={{ fontSize: cfg.statValueFont, fontWeight: 800, color: template.textColor }}>{sessionsText}</div>
        </div>
      </div>
    </div>
  );
});

export default AchievementCard;
