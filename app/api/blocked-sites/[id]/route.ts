import { NextRequest } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/currentUser";
import { deleteSite } from "@/lib/repos/blockerRepo";
import { corsJson, handleOptions } from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS() {
  return handleOptions();
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return corsJson({ error: "Belum ada sesi." }, { status: 401 });

  await deleteSite(user.id, params.id);
  return corsJson({ ok: true });
}
