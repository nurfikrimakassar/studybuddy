import { NextResponse } from "next/server";
import { createOAuthClient, SCOPES } from "@/lib/auth/googleOAuth";

export const runtime = "nodejs";

// GET /api/auth/google — arahkan user ke consent screen Google
export async function GET() {
  const oauth2Client = createOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // wajib supaya dapat refresh_token
    prompt: "consent", // paksa consent screen tiap kali, supaya refresh_token selalu dikirim ulang
    scope: SCOPES,
  });
  return NextResponse.redirect(url);
}
