type LogoProps = {
  size?: number;
  boxColor?: string;
  glyphColor?: string;
  radius?: number;
};

/**
 * StudyBuddy mark: a binoculars glyph (flat Notion-style illustration)
 * inside a rounded-square, used in the top bar and footer.
 */
export default function Logo({
  size = 30,
  boxColor = "#3A3170",
  glyphColor = "#EFEBFB",
  radius = 9,
}: LogoProps) {
  const iconSize = Math.round(size * 0.6);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: boxColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <rect x="3.8" y="4.6" width="6" height="14.8" rx="3" fill={glyphColor} />
        <rect x="14.2" y="4.6" width="6" height="14.8" rx="3" fill={glyphColor} />
        <rect x="8.6" y="7" width="6.8" height="2.8" rx="1.4" fill={glyphColor} />
        <circle cx="6.8" cy="14.6" r="1.9" fill={boxColor} />
        <circle cx="17.2" cy="14.6" r="1.9" fill={boxColor} />
      </svg>
    </div>
  );
}
