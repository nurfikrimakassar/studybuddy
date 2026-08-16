import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";

export const runtime = "nodejs";

// GET /api/me — dipakai frontend untuk cek status login
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.created_at,
  });
}
