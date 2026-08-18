import { NextRequest } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/currentUser";
import { corsJson, handleOptions } from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS() {
  return handleOptions();
}

// GET /api/me — dipakai frontend (web & extension) untuk cek status login
export async function GET(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) {
    return corsJson({ error: "Belum login." }, { status: 401 });
  }
  return corsJson({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.created_at,
  });
}
