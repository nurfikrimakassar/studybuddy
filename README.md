# StudyBuddy — Landing Page (Next.js)

Landing page pre-launch untuk StudyBuddy, dibangun dengan Next.js 14 (App Router) + TypeScript, tanpa CSS framework (inline styles + `app/globals.css` untuk reset & responsive rules), mengikuti sistem desain di build prompt (warna, tipografi Manrope/Newsreader, spacing).

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Build production

```bash
npm run build
npm start
```

## Struktur

```
app/
  layout.tsx      # root layout, load font Manrope & Newsreader via <link>
  globals.css      # design tokens (CSS vars) + reset + responsive rules
  page.tsx         # merangkai semua section
components/
  TopBar.tsx
  Hero.tsx                # headline + mockup dashboard sesi fokus
  WaitlistFormHero.tsx     # form waitlist versi hero (client component)
  WaitlistFormCompact.tsx  # form waitlist versi final CTA (client component)
  WaitlistContext.tsx      # state waitlist dibagi antara Hero & Final CTA
  Problem.tsx
  Features.tsx     # grid 6 fitur + mini mockup tiap fitur
  HowItWorks.tsx
  SocialProof.tsx
  FinalCTA.tsx
  Footer.tsx
  Logo.tsx          # ikon teropong, dipakai di top bar & footer
```

## Catatan implementasi

- **State waitlist dibagikan** antara form di Hero dan form di Final CTA lewat `WaitlistContext`, jadi begitu satu form disubmit, kedua section menampilkan status "sudah masuk daftar tunggu" — mengikuti perilaku komponen asli di design comp.
- **Font** dimuat lewat tag `<link>` ke Google Fonts di `app/layout.tsx` (bukan `next/font/google`) supaya build tidak butuh akses jaringan ke `fonts.googleapis.com` saat compile time. Kalau environment build kamu punya akses internet penuh dan mau font di-self-host otomatis oleh Next.js (menghindari layout shift), ini bisa diganti ke `next/font/google` — sudah dikomentari caranya di `layout.tsx`.
- Semua warna, spacing, dan breakpoint (640px, 900px) mengikuti spesifikasi asli di build prompt secara persis.
- Belum ada backend nyata untuk form waitlist (sesuai brief), tapi `WaitlistContext.submit()` adalah satu titik yang tinggal dihubungkan ke API/Supabase/Google Sheets dsb.

## Deploy

Project ini siap untuk di-deploy ke Vercel (`vercel deploy` atau lewat dashboard, tidak perlu konfigurasi tambahan).
