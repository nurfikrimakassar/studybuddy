# StudyBuddy — Full-stack di satu project Vercel (gratis)

Landing page + backend (Tahap 1 roadmap: login Google OAuth, session, database) digabung jadi **satu** project Next.js 14 (App Router). Frontend = React Server/Client Components, backend = Next.js Route Handlers yang jalan sebagai serverless functions di Vercel. Tidak ada server terpisah yang perlu di-host di Railway/Render — semuanya satu `vercel deploy`.

## Kenapa bisa full gratis

| Kebutuhan | Layanan | Tier gratis |
|---|---|---|
| Hosting frontend + API | **Vercel** (Hobby plan) | Cukup untuk trafik kecil–menengah |
| Database | **Vercel Postgres** (Storage tab, di-*power* oleh Neon) | 0.5 GB storage, 60 compute-hours/bulan |
| Login | **Google OAuth 2.0** | Gratis, tidak ada biaya API |
| PDF Summarizer / Flashcard (Tahap 3, menyusul) | **Gemini API** (aistudio.google.com) | Free tier tersedia, ada rate limit |

Satu-satunya biaya yang mungkin muncul nanti: **Chrome Web Store developer registration** untuk publish extension Site Blocker (Tahap 5) — biaya pendaftaran satu kali, bukan biaya hosting.

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env.local
```

Isi `.env.local` — untuk dev, `POSTGRES_URL` bisa nunjuk ke Postgres lokal kamu dulu (aku sudah tes semua route pakai Postgres biasa, protokolnya sama persis dengan Vercel Postgres). `GOOGLE_CLIENT_ID`/`SECRET` boleh diisi belakangan; tanpa itu, semua route jalan normal kecuali proses tukar token OAuth beneran.

```bash
npm run migrate   # bikin 5 tabel: users, schedule_items, pomodoro_sessions, blocked_categories, blocked_sites
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Setup Vercel Postgres (sekali di awal)

1. Buat project di Vercel (import dari GitHub, atau `vercel deploy` dari folder ini).
2. Di dashboard project → tab **Storage** → **Create Database** → pilih **Postgres**. Vercel otomatis inject `POSTGRES_URL` (dan variannya) ke Environment Variables project ini — tidak perlu isi manual di production.
3. Tarik env var itu ke lokal untuk jalanin migrasi sekali:
   ```bash
   npm i -g vercel   # kalau belum ada
   vercel link
   vercel env pull .env.local
   npm run migrate
   ```

## Setup Google OAuth

1. [console.cloud.google.com](https://console.cloud.google.com) → buat project → aktifkan **Google Calendar API** dan **Google People API**.
2. **Credentials** → **Create OAuth Client ID** → tipe *Web application*.
3. **Authorized redirect URIs**, tambahkan keduanya:
   - `http://localhost:3000/api/auth/google/callback` (dev)
   - `https://nama-project-kamu.vercel.app/api/auth/google/callback` (production, sesuaikan domain)
4. Copy `Client ID` & `Client Secret` ke `.env.local` (dev) dan ke Vercel Environment Variables (production).

## Environment Variables yang perlu diisi di Vercel

Selain `POSTGRES_URL` (otomatis), tambahkan manual di Settings → Environment Variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` → `https://nama-project-kamu.vercel.app/api/auth/google/callback`
- `JWT_SECRET` → generate dengan `openssl rand -hex 32`
- `NEXT_PUBLIC_APP_URL` → `https://nama-project-kamu.vercel.app`

## Struktur

```
app/
  layout.tsx, globals.css, page.tsx    # landing page (sama seperti sebelumnya)
  dashboard/page.tsx                    # placeholder halaman setelah login, bukti alur OAuth jalan
  api/
    health/route.ts
    auth/google/route.ts                # mulai login, redirect ke Google
    auth/google/callback/route.ts        # tukar code -> token, upsert user, set session cookie
    auth/logout/route.ts
    me/route.ts                          # status login untuk frontend
components/
  landing-page/                          # semua komponen landing page (lihat README versi sebelumnya)
lib/
  db.ts                    # koneksi pg Pool (baca POSTGRES_URL)
  usersRepo.ts              # upsert/find user
  auth/
    googleOAuth.ts           # OAuth2 client + scope
    session.ts                # sign/verify JWT, cookie options
    currentUser.ts             # baca cookie session -> user (dipakai Route Handler & Server Component)
db/migrations/001_init.sql   # skema 5 tabel
scripts/migrate.js            # runner migrasi, dijalankan manual lewat `npm run migrate`
```

## Yang sudah dites di sandbox

- `npm run build` → sukses, semua route (`/api/health`, `/api/auth/google`, `/api/auth/google/callback`, `/api/auth/logout`, `/api/me`, `/dashboard`) terdaftar dengan benar.
- `npm run migrate` → 5 tabel + index terbentuk.
- `GET /api/health` → `200 {ok:true}`.
- `GET /api/me` tanpa cookie → `401`.
- `GET /api/auth/google` → redirect ke `accounts.google.com` dengan scope & `redirect_uri` benar.
- `GET /dashboard` tanpa login → redirect ke `/`.
- Simulasi user login (insert user + sign JWT manual, tanpa consent Google asli karena butuh kredensial kamu) → `GET /api/me` dan `GET /dashboard` dengan cookie session mengembalikan nama & email yang benar dari database.

Yang **belum** bisa dites di sandbox ini: pertukaran `code` → token dengan Google beneran (butuh `GOOGLE_CLIENT_ID`/`SECRET` asli kamu dan browser real untuk consent screen).

## Catatan pg Pool di serverless

`lib/db.ts` pakai `pg.Pool` biasa dengan `max: 3` per instance function — cukup untuk MVP di free tier. Kalau nanti trafik naik dan mulai kena "too many connections" dari Postgres, opsi upgrade: pindah ke `@vercel/postgres` (driver HTTP khusus Neon, didesain untuk serverless) atau Prisma Accelerate. Tidak mendesak untuk sekarang.

## Belum termasuk (menyusul di roadmap)
- `POST /api/schedule` + sinkron `events.insert` ke Google Calendar (Tahap 2)
- Integrasi Gemini untuk PDF Summarizer & Flashcard/Quiz (Tahap 3)
- `POST /api/pomodoro/session` + logic streak + `GET /api/stats/summary` (Tahap 4)
- Chrome Extension site blocker (Tahap 5, project terpisah — satu-satunya bagian yang tidak jalan di Vercel)
