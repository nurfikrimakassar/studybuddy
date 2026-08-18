import { NextRequest } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/currentUser";
import { getStreakDays, getTodayFocusStats } from "@/lib/repos/pomodoroRepo";
import { corsJson, handleOptions } from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return corsJson({ error: "Belum ada sesi." }, { status: 401 });

  const [{ sessionsToday, minutesToday }, streakDays] = await Promise.all([
    getTodayFocusStats(user.id),
    getStreakDays(user.id),
  ]);

  return corsJson({ streakDays, minutesToday, sessionsToday });
}
