import type { Metadata } from "next";
import "./globals.css";

// Loaded via <link> (not next/font/google) so the fonts are fetched by the
// browser at runtime rather than by the bundler at build time — avoids
// requiring outbound access to fonts.googleapis.com during `next build`
// in network-restricted environments (e.g. CI, sandboxed dev containers).
// Swap this for next/font/google if your build environment has open
// internet access and you want self-hosted, zero-layout-shift fonts.

export const metadata: Metadata = {
  title: "StudyBuddy — Study sessions built for focus",
  description:
    "StudyBuddy membantu kamu belajar lebih fokus dan lebih efektif, dari menjaga fokus, memahami materi, sampai merayakan progres yang bisa kamu pamerkan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,wght@1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
