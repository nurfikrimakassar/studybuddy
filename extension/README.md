# StudyBuddy Chrome Extension

Pomodoro timer + Site Blocker langsung dari toolbar Chrome, terhubung ke
akun StudyBuddy yang sama dengan web app (`/app`).

## Install (development / unpacked)

1. Buka `chrome://extensions`
2. Aktifkan **Developer mode** (toggle di pojok kanan atas)
3. Klik **Load unpacked** → pilih folder `extension/` ini
4. Klik ikon puzzle 🧩 di toolbar Chrome → pin StudyBuddy biar keliatan terus

## Hubungkan ke akun

1. Buka `https://studybuddy.nurfikri.com/app/extension`
2. Salin token yang ditampilkan
3. Klik ikon StudyBuddy di toolbar → tempel token → **Hubungkan**

## Cara kerja singkat

- **Timer** jalan di `background.js` (service worker) pakai `chrome.alarms`
  buat penjadwalan yang akurat walau popup ditutup / browser idle.
- **Site Blocker** pakai `declarativeNetRequest` dynamic rules — daftar
  situs ditarik dari `GET /api/blocked-sites`, aturan blokir cuma aktif
  selama mode timer = "focus".
- Auth pakai **Bearer token** (`Authorization: Bearer <token>`), bukan
  cookie — extension nggak bisa pakai cookie session web karena
  `SameSite` browser ngeblokir cookie itu buat request cross-origin dari
  extension. Token di-generate dari halaman `/app/extension` (butuh login
  cookie biasa di web), disimpan di `chrome.storage.local` si extension.
- Sesi yang selesai dicatat ke `POST /api/pomodoro/session` — data
  langsung kebaca di halaman web (`/app/share`, `/app`) karena satu akun
  yang sama.

## Ganti ke localhost buat dev

Edit `config.js`, ganti `API_BASE` ke `http://localhost:3000`, dan tambahin
`"http://localhost:3000/*"` ke `host_permissions` di `manifest.json`.
