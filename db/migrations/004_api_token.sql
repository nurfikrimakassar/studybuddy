-- Token akses buat Chrome extension — extension nggak bisa pakai cookie
-- session (kena batasan SameSite browser buat request cross-origin), jadi
-- pakai token panjang random yang di-generate sekali dari web, disimpan di
-- extension, dikirim sebagai Authorization: Bearer <token>.
ALTER TABLE users ADD COLUMN IF NOT EXISTS api_token TEXT UNIQUE;
