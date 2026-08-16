import { google } from "googleapis";

// Scope calendar diminta sekaligus saat login, sesuai Tahap 1 roadmap —
// supaya user cuma perlu consent screen sekali untuk fitur Jadwal (Tahap 2).
export const SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar",
];

export function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}
