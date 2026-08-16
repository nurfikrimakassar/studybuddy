import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { deleteCategory, toggleCategory } from "@/lib/repos/blockerRepo";

export const runtime = "nodejs";

// PATCH /api/blocked-categories/:id — toggle enabled/disabled
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Belum ada sesi." }, { status: 401 });

  const category = await toggleCategory(user.id, params.id);
  if (!category) return NextResponse.json({ error: "Kategori tidak ditemukan." }, { status: 404 });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Belum ada sesi." }, { status: 401 });

  await deleteCategory(user.id, params.id);
  return NextResponse.json({ ok: true });
}
