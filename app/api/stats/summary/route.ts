import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { getStreakDays, getTodayFocusStats } from "@/lib/repos/pomodoroRepo";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Belum ada sesi." }, { status: 401 });

  const [{ sessionsToday, minutesToday }, streakDays] = await Promise.all([
    getTodayFocusStats(user.id),
    getStreakDays(user.id),
  ]);

  return NextResponse.json({ streakDays, minutesToday, sessionsToday });
}
