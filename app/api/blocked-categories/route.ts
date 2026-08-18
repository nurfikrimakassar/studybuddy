import { NextRequest } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/currentUser";
import { createCategory, listCategories } from "@/lib/repos/blockerRepo";
import { corsJson, handleOptions } from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return corsJson({ error: "Belum ada sesi." }, { status: 401 });

  const categories = await listCategories(user.id);
  return corsJson(categories);
}

// POST /api/blocked-categories — { label, domains: "a.com, b.com" }
export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return corsJson({ error: "Belum ada sesi." }, { status: 401 });

  const { label, domains } = await req.json();
  const cleanLabel = typeof label === "string" ? label.trim() : "";
  const domainList: string[] = typeof domains === "string"
    ? domains.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean)
    : [];

  if (!cleanLabel || domainList.length === 0) {
    return corsJson({ error: "label dan domains wajib diisi." }, { status: 400 });
  }

  const category = await createCategory(user.id, cleanLabel, domainList);
  return corsJson(category, { status: 201 });
}
