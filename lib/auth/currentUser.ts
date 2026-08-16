import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth/session";
import { findUserById, type User } from "@/lib/usersRepo";

/**
 * Reads the session cookie (works in Server Components and Route Handlers),
 * verifies the JWT, and loads the user row. Returns null if not logged in
 * or the session is invalid/expired — callers decide how to react (redirect,
 * 401 JSON, etc).
 */
export async function getCurrentUser(): Promise<User | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = verifySession(token);
    return await findUserById(payload.sub);
  } catch {
    return null;
  }
}
