-- Tahap 3a: izinkan user anonim (Firebase Anonymous Auth) tanpa email/nama,
-- supaya Pomodoro/Blocker/Share bisa nyimpen histori asli sebelum user login.
-- Dijalankan lewat: npm run migrate

ALTER TABLE users
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN name DROP NOT NULL,
  ALTER COLUMN firebase_uid SET NOT NULL;
