import jwt from "jsonwebtoken";

export const COOKIE_NAME = "sb_session";
const EXPIRES_IN = "7d";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function signSession(userId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET belum di-set.");
  return jwt.sign({ sub: userId }, secret, { expiresIn: EXPIRES_IN });
}

export function verifySession(token: string): { sub: string } {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET belum di-set.");
  return jwt.verify(token, secret) as { sub: string };
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  };
}
