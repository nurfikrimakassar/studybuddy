import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { ensureApiToken, regenerateApiToken } from "@/lib/usersRepo";

export const runtime = "nodejs";

// GET /api/extension/token — dipanggil dari web app (pakai cookie session)
// buat ambil/generate token yang di-paste user ke Chrome extension.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Belum ada sesi." }, { status: 401 });

  const token = await ensureApiToken(user.id);
  return NextResponse.json({ token });
}

// POST /api/extension/token — regenerate token baru (misal token lama dicurigai bocor).
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Belum ada sesi." }, { status: 401 });

  const token = await regenerateApiToken(user.id);
  return NextResponse.json({ token });
}
