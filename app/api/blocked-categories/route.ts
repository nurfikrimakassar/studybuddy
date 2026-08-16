import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { createCategory, listCategories } from "@/lib/repos/blockerRepo";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Belum ada sesi." }, { status: 401 });

  const categories = await listCategories(user.id);
  return NextResponse.json(categories);
}

// POST /api/blocked-categories — { label, domains: "a.com, b.com" }
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Belum ada sesi." }, { status: 401 });

  const { label, domains } = await req.json();
  const cleanLabel = typeof label === "string" ? label.trim() : "";
  const domainList: string[] = typeof domains === "string"
    ? domains.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean)
    : [];

  if (!cleanLabel || domainList.length === 0) {
    return NextResponse.json({ error: "label dan domains wajib diisi." }, { status: 400 });
  }

  const category = await createCategory(user.id, cleanLabel, domainList);
  return NextResponse.json(category, { status: 201 });
}
