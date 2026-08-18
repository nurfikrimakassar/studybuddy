import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/auth/session";
import { findUserByApiToken, findUserById, type User } from "@/lib/usersRepo";

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

/**
 * Same as getCurrentUser, but also accepts an `Authorization: Bearer <token>`
 * header — the Chrome extension can't rely on the session cookie (SameSite
 * blocks it on cross-site fetches), so it authenticates with a long-lived
 * api_token instead. Web app requests keep working via the cookie fallback.
 */
export async function getCurrentUserFromRequest(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    if (token) return findUserByApiToken(token);
  }
  return getCurrentUser();
}
