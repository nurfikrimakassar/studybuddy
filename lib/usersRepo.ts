import { pool } from "@/lib/db";

export type User = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

/**
 * Insert a user on first login, or update their name/tokens on subsequent
 * logins. Google only sends a refresh_token on the very first consent (or
 * when prompt=consent is forced), so we keep the existing one on file if
 * the new login didn't return one.
 */
export async function upsertUserFromGoogle({
  email,
  name,
  accessToken,
  refreshToken,
}: {
  email: string;
  name: string;
  accessToken?: string | null;
  refreshToken?: string | null;
}): Promise<User> {
  const { rows } = await pool.query(
    `INSERT INTO users (email, name, google_access_token, google_refresh_token)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET
       name = EXCLUDED.name,
       google_access_token = EXCLUDED.google_access_token,
       google_refresh_token = COALESCE(EXCLUDED.google_refresh_token, users.google_refresh_token)
     RETURNING id, email, name, created_at`,
    [email, name, accessToken || null, refreshToken || null]
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
