import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/auth/googleOAuth";
import { signSession, cookieOptions, COOKIE_NAME } from "@/lib/auth/session";
import { upsertUserFromGoogle } from "@/lib/usersRepo";

export const runtime = "nodejs";

// GET /api/auth/google/callback — ditembak Google setelah user setuju
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

  if (error) {
    return NextResponse.redirect(`${appUrl}/?error=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return NextResponse.redirect(`${appUrl}/?error=missing_code`);
  }

  try {
    const oauth2Client = createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (!tokens.id_token) {
      throw new Error("Google tidak mengembalikan id_token.");
    }

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new Error("Payload id_token tidak berisi email.");
    }

    const user = await upsertUserFromGoogle({
      email: payload.email,
      name: payload.name || payload.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });

    const sessionToken = signSession(user.id);
    const response = NextResponse.redirect(`${appUrl}/dashboard`);
    response.cookies.set(COOKIE_NAME, sessionToken, cookieOptions());
    return response;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[auth] Google callback failed:", err);
    return NextResponse.redirect(`${appUrl}/?error=auth_failed`);
  }
}
