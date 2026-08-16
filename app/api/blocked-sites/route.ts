import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { addCustomSite, listCategories, listCustomSites } from "@/lib/repos/blockerRepo";

export const runtime = "nodejs";

// GET /api/blocked-sites — semua domain yang aktif diblokir (dari kategori
// yang enabled + situs kustom), dipakai buat info "Diblokir sekarang" di Pomodoro.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Belum ada sesi." }, { status: 401 });

  const [categories, customSites] = await Promise.all([listCategories(user.id), listCustomSites(user.id)]);
  const domains = [
    ...categories.filter((c) => c.enabled).flatMap((c) => c.sites),
    ...customSites.map((s) => s.domain),
  ];
  return NextResponse.json({ domains, customSites });
}

// POST /api/blocked-sites — { domain: "reddit.com" }
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Belum ada sesi." }, { status: 401 });

  const { domain } = await req.json();
  const cleanDomain = typeof domain === "string" ? domain.trim().toLowerCase() : "";
  if (!cleanDomain) return NextResponse.json({ error: "domain wajib diisi." }, { status: 400 });

  const site = await addCustomSite(user.id, cleanDomain);
  return NextResponse.json(site, { status: 201 });
}
