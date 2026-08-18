import { NextRequest } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/currentUser";
import { addCustomSite, listCategories, listCustomSites } from "@/lib/repos/blockerRepo";
import { corsJson, handleOptions } from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS() {
  return handleOptions();
}

// GET /api/blocked-sites — semua domain yang aktif diblokir (dari kategori
// yang enabled + situs kustom), dipakai buat info "Diblokir sekarang" di Pomodoro.
export async function GET(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return corsJson({ error: "Belum ada sesi." }, { status: 401 });

  const [categories, customSites] = await Promise.all([listCategories(user.id), listCustomSites(user.id)]);
  const domains = [
    ...categories.filter((c) => c.enabled).flatMap((c) => c.sites),
    ...customSites.map((s) => s.domain),
  ];
  return corsJson({ domains, customSites });
}

// POST /api/blocked-sites — { domain: "reddit.com" }
export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return corsJson({ error: "Belum ada sesi." }, { status: 401 });

  const { domain } = await req.json();
  const cleanDomain = typeof domain === "string" ? domain.trim().toLowerCase() : "";
  if (!cleanDomain) return corsJson({ error: "domain wajib diisi." }, { status: 400 });

  const site = await addCustomSite(user.id, cleanDomain);
  return corsJson(site, { status: 201 });
}
