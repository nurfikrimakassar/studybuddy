import { NextRequest } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/currentUser";
import { deleteCategory, toggleCategory } from "@/lib/repos/blockerRepo";
import { corsJson, handleOptions } from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS() {
  return handleOptions();
}

// PATCH /api/blocked-categories/:id — toggle enabled/disabled
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return corsJson({ error: "Belum ada sesi." }, { status: 401 });

  const category = await toggleCategory(user.id, params.id);
  if (!category) return corsJson({ error: "Kategori tidak ditemukan." }, { status: 404 });
  return corsJson(category);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return corsJson({ error: "Belum ada sesi." }, { status: 401 });

  await deleteCategory(user.id, params.id);
  return corsJson({ ok: true });
}
