import { randomBytes } from "crypto";
import { pool } from "@/lib/db";

export type User = {
  id: string;
  email: string | null;
  name: string | null;
  created_at: string;
};

/**
 * Insert a user on first sign-in (anonymous or Google), or update on
 * subsequent ones. Keyed on Firebase UID since that's the stable identity
 * Firebase Auth gives us — anonymous sign-in and linking to Google both
 * keep the same UID, so this naturally "upgrades" a guest's row in place
 * (and keeps their existing pomodoro/blocker history attached) once they
 * link a Google account. Anonymous calls omit email/name; COALESCE keeps
 * whatever's already on file instead of overwriting it with null.
 */
export async function upsertUserFromFirebase({
  firebaseUid,
  email,
  name,
}: {
  firebaseUid: string;
  email?: string | null;
  name?: string | null;
}): Promise<User> {
  const { rows } = await pool.query(
    `INSERT INTO users (firebase_uid, email, name)
     VALUES ($1, $2, $3)
     ON CONFLICT (firebase_uid) DO UPDATE SET
       email = COALESCE(EXCLUDED.email, users.email),
       name = COALESCE(EXCLUDED.name, users.name)
     RETURNING id, email, name, created_at`,
    [firebaseUid, email || null, name || null]
  );
  return rows[0];
}

export async function findUserById(id: string): Promise<User | null> {
  const { rows } = await pool.query(
    `SELECT id, email, name, created_at FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function findUserByApiToken(token: string): Promise<User | null> {
  const { rows } = await pool.query(
    `SELECT id, email, name, created_at FROM users WHERE api_token = $1`,
    [token]
  );
  return rows[0] || null;
}

/** Buat token kalau user belum punya, atau balikin yang udah ada — dipakai buat konek Chrome extension. */
export async function ensureApiToken(userId: string): Promise<string> {
  const { rows } = await pool.query(`SELECT api_token FROM users WHERE id = $1`, [userId]);
  if (rows[0]?.api_token) return rows[0].api_token;

  const token = randomBytes(24).toString("base64url");
  await pool.query(`UPDATE users SET api_token = $1 WHERE id = $2`, [token, userId]);
  return token;
}

/** Ganti ke token baru (misal kalau extension lama dicurigai bocor). */
export async function regenerateApiToken(userId: string): Promise<string> {
  const token = randomBytes(24).toString("base64url");
  await pool.query(`UPDATE users SET api_token = $1 WHERE id = $2`, [token, userId]);
  return token;
}
