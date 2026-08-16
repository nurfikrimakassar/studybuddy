-- Tahap 1b: pindah identitas login dari custom Google OAuth ke Firebase Auth
-- Dijalankan lewat: npm run migrate

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS firebase_uid TEXT UNIQUE,
  DROP COLUMN IF EXISTS google_access_token,
  DROP COLUMN IF EXISTS google_refresh_token;
