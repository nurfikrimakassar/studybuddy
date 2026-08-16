import { pool } from "@/lib/db";

export type User = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

/**
 * Insert a user on first login, or update their name on subsequent logins.
 * Keyed on Firebase UID since that's the stable identity Firebase Auth gives us.
 */
export async function upsertUserFromFirebase({
  firebaseUid,
  email,
  name,
}: {
  firebaseUid: string;
  email: string;
  name: string;
}): Promise<User> {
  const { rows } = await pool.query(
    `INSERT INTO users (firebase_uid, email, name)
     VALUES ($1, $2, $3)
     ON CONFLICT (firebase_uid) DO UPDATE SET
       email = EXCLUDED.email,
       name = EXCLUDED.name
     RETURNING id, email, name, created_at`,
    [firebaseUid, email, name]
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
