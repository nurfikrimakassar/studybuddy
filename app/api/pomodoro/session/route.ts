import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { logPomodoroSession } from "@/lib/repos/pomodoroRepo";

export const runtime = "nodejs";

// POST /api/pomodoro/session — catat satu sesi fokus/istirahat yang selesai.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Belum ada sesi." }, { status: 401 });
  }

  const { durationMinutes, completed } = await req.json();
  if (typeof durationMinutes !== "number" || durationMinutes <= 0) {
    return NextResponse.json({ error: "durationMinutes wajib diisi angka positif." }, { status: 400 });
  }

  const session = await logPomodoroSession({
    userId: user.id,
    durationMinutes,
    completed: Boolean(completed),
  });
  return NextResponse.json(session);
}
