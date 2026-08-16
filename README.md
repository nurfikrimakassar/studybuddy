# StudyBuddy — Full-stack di satu project Vercel (gratis)

Landing page + backend (Tahap 1 roadmap: login Google OAuth, session, database) digabung jadi **satu** project Next.js 14 (App Router). Frontend = React Server/Client Components, backend = Next.js Route Handlers yang jalan sebagai serverless functions di Vercel. Tidak ada server terpisah yang perlu di-host di Railway/Render — semuanya satu `vercel deploy`.

## Kenapa bisa full gratis

| Kebutuhan | Layanan | Tier gratis |
|---|---|---|
| Hosting frontend + API | **Vercel** (Hobby plan) | Cukup untuk trafik kecil–menengah |
| Database | **Neon Postgres** (Storage tab di Vercel) | 0.5 GB storage, 100 compute-hours/bulan |
| Login | **Firebase Authentication** (Google provider) | Gratis, tanpa batas MAU (limit 50rb MAU cuma berlaku buat fitur enterprise SAML/OIDC, bukan Google Sign-In) |
| PDF Summarizer / Flashcard (Tahap 3, menyusul) | **Gemini API** (aistudio.google.com) | Free tier tersedia, ada rate limit |

Satu-satunya biaya yang mungkin muncul nanti: **Chrome Web Store developer registration** untuk publish extension Site Blocker (Tahap 5) — biaya pendaftaran satu kali, bukan biaya hosting.

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env.local
```

Isi `.env.local` — untuk dev, `POSTGRES_URL` bisa nunjuk ke Postgres lokal kamu dulu (protokolnya sama persis dengan Neon). Env var `FIREBASE_*`/`NEXT_PUBLIC_FIREBASE_*` boleh diisi belakangan; tanpa itu, semua route jalan normal kecuali tombol login (bakal error saat dipencet).

```bash
npm run migrate   # bikin 5 tabel: users, schedule_items, pomodoro_sessions, blocked_categories, blocked_sites
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Setup Neon Postgres (sekali di awal)

1. Buat project di Vercel (import dari GitHub, atau `vercel deploy` dari folder ini).
2. Di dashboard project → tab **Storage** → **Create Database** → pilih **Neon** dari marketplace. Matikan toggle **Auth** bawaan Neon (kita pakai Firebase Auth, bukan itu). Vercel otomatis inject `POSTGRES_URL` ke Environment Variables project ini.
3. Tarik env var itu ke lokal untuk jalanin migrasi sekali:
   ```bash
   npm i -g vercel   # kalau belum ada
   vercel link
   vercel env pull .env.local
   npm run migrate
   ```

## Setup Firebase Auth

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → ikuti wizard-nya.
2. **Authentication** → tab **Sign-in method** → aktifkan provider **Google**.
3. **Project Settings** (ikon gear) → tab **General** → scroll ke **Your apps** → klik ikon web (`</>`) buat register web app. Copy `apiKey`, `authDomain`, `projectId`, `appId` yang muncul → ini buat `NEXT_PUBLIC_FIREBASE_*` di `.env.local`/Vercel.
4. **Project Settings** → tab **Service accounts** → **Generate new private key** → download file JSON. Isi dari file itu buat `FIREBASE_PROJECT_ID` (`project_id`), `FIREBASE_CLIENT_EMAIL` (`client_email`), `FIREBASE_PRIVATE_KEY` (`private_key`, termasuk `\n`-nya, dibungkus tanda kutip).
5. **Authentication** → **Settings** → tab **Authorized domains** → tambahkan domain production kamu (misal `nama-project.vercel.app`) — `localhost` udah otomatis ada.

## Environment Variables yang perlu diisi di Vercel

Selain `POSTGRES_URL` (otomatis dari Neon), tambahkan manual di Settings → Environment Variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `JWT_SECRET` → generate dengan `openssl rand -hex 32`
- `NEXT_PUBLIC_APP_URL` → `https://nama-project-kamu.vercel.app`

## Struktur

```
app/
  layout.tsx, globals.css, page.tsx    # landing page
  dashboard/page.tsx                    # placeholder halaman setelah login, bukti alur auth jalan
  api/
    health/route.ts
    auth/session/route.ts                # terima idToken Firebase dari client, verifikasi, set session cookie
    auth/logout/route.ts
    me/route.ts                          # status login untuk frontend
components/
  auth/
    GoogleSignInButton.tsx    # client component: signInWithPopup(Firebase) -> POST /api/auth/session
  landing-page/                          # semua komponen landing page
lib/
  db.ts                    # koneksi pg Pool (baca POSTGRES_URL)
  usersRepo.ts              # upsert/find user (keyed by firebase_uid)
  firebase/
    client.ts                 # init Firebase client SDK (lazy, dipakai browser)
    admin.ts                   # init Firebase Admin SDK (lazy, dipakai server buat verifyIdToken)
  auth/
    session.ts                # sign/verify JWT kita sendiri, cookie options
    currentUser.ts             # baca cookie session -> user (dipakai Route Handler & Server Component)
db/migrations/
  001_init.sql                # skema 5 tabel
  002_firebase_auth.sql        # tambah kolom firebase_uid, hapus kolom token Google lama
scripts/migrate.js            # runner migrasi, dijalankan manual lewat `npm run migrate`
```

## Yang sudah dites

- `npm run build` → sukses, semua route (`/api/health`, `/api/auth/session`, `/api/auth/logout`, `/api/me`, `/dashboard`) terdaftar dengan benar.
- `npm run migrate` → tabel + index terbentuk, termasuk migration `002_firebase_auth.sql`.

Yang **belum** dites: login beneran lewat popup Firebase (butuh project Firebase asli dengan provider Google aktif, dan env var `FIREBASE_*`/`NEXT_PUBLIC_FIREBASE_*` keisi di Vercel).

## Catatan pg Pool di serverless

`lib/db.ts` pakai `pg.Pool` biasa dengan `max: 3` per instance function — cukup untuk MVP di free tier. Kalau nanti trafik naik dan mulai kena "too many connections" dari Postgres, opsi upgrade: pindah ke `@vercel/postgres` (driver HTTP khusus Neon, didesain untuk serverless) atau Prisma Accelerate. Tidak mendesak untuk sekarang.

## Belum termasuk (menyusul di roadmap)
- `POST /api/schedule` + sinkron `events.insert` ke Google Calendar (Tahap 2)
- Integrasi Gemini untuk PDF Summarizer & Flashcard/Quiz (Tahap 3)
- `POST /api/pomodoro/session` + logic streak + `GET /api/stats/summary` (Tahap 4)
- Chrome Extension site blocker (Tahap 5, project terpisah — satu-satunya bagian yang tidak jalan di Vercel)
