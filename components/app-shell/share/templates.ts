export type CardTemplate = {
  id: string;
  name: string;
  swatch: string;
  cardBackground: string; // dipakai kartu compact (preview & download)
  storyBackground: string; // dipakai kartu 9:16 (share ke Story), boleh gradient
  labelColor: string;
  textColor: string;
  subTextColor: string;
  dividerColor: string;
  border?: string;
  logoBg: string;
  logoGlyph: string;
};

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: "fokus",
    name: "Fokus",
    swatch: "#3A3170",
    cardBackground: "#3A3170",
    storyBackground: "linear-gradient(160deg, #3A3170, #1E1B33)",
    labelColor: "#B8AEDF",
    textColor: "#fff",
    subTextColor: "#CFC6EA",
    dividerColor: "rgba(255,255,255,0.15)",
    logoBg: "rgba(255,255,255,0.15)",
    logoGlyph: "#fff",
  },
  {
    id: "streak",
    name: "Streak",
    swatch: "#9A5347",
    cardBackground: "#9A5347",
    storyBackground: "linear-gradient(160deg, #C2694B, #7A3C30)",
    labelColor: "#F5DCCF",
    textColor: "#fff",
    subTextColor: "#F0CFC0",
    dividerColor: "rgba(255,255,255,0.2)",
    logoBg: "rgba(255,255,255,0.18)",
    logoGlyph: "#fff",
  },
  {
    id: "minimal",
    name: "Minimal",
    swatch: "#EFEBFB",
    cardBackground: "#fff",
    storyBackground: "#FAF8FC",
    labelColor: "#4B4090",
    textColor: "#1E1B33",
    subTextColor: "#7A7593",
    dividerColor: "#EAE6F6",
    border: "1px solid #EAE6F6",
    logoBg: "#3A3170",
    logoGlyph: "#fff",
  },
];
