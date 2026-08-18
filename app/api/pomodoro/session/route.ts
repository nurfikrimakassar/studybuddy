import { NextRequest } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/currentUser";
import { logPomodoroSession } from "@/lib/repos/pomodoroRepo";
import { corsJson, handleOptions } from "@/lib/cors";

export const runtime = "nodejs";

export async function OPTIONS() {
  return handleOptions();
}

// POST /api/pomodoro/session — catat satu sesi fokus/istirahat yang selesai.
export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) {
    return corsJson({ error: "Belum ada sesi." }, { status: 401 });
  }

  const { durationMinutes, completed } = await req.json();
  if (typeof durationMinutes !== "number" || durationMinutes <= 0) {
    return corsJson({ error: "durationMinutes wajib diisi angka positif." }, { status: 400 });
  }

  const session = await logPomodoroSession({
    userId: user.id,
    durationMinutes,
    completed: Boolean(completed),
  });
  return corsJson(session);
}
