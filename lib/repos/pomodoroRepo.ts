import { pool } from "@/lib/db";

export async function logPomodoroSession({
  userId,
  durationMinutes,
  completed,
}: {
  userId: string;
  durationMinutes: number;
  completed: boolean;
}) {
  const { rows } = await pool.query(
    `INSERT INTO pomodoro_sessions (user_id, duration_minutes, completed)
     VALUES ($1, $2, $3)
     RETURNING id, started_at, duration_minutes, completed`,
    [userId, durationMinutes, completed]
  );
  return rows[0];
}

export async function getTodayFocusStats(userId: string) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS sessions, COALESCE(SUM(duration_minutes), 0)::int AS minutes
     FROM pomodoro_sessions
     WHERE user_id = $1 AND completed = true AND started_at >= date_trunc('day', now())`,
    [userId]
  );
  return { sessionsToday: rows[0].sessions as number, minutesToday: rows[0].minutes as number };
}

/** Ronde berjalan (streak) hari-hari berturut-turut yang punya minimal 1 sesi fokus selesai. */
export async function getStreakDays(userId: string) {
  const { rows } = await pool.query(
    `SELECT DISTINCT date_trunc('day', started_at) AS day
     FROM pomodoro_sessions
     WHERE user_id = $1 AND completed = true
     ORDER BY day DESC
     LIMIT 365`,
    [userId]
  );

  if (rows.length === 0) return 0;

  const days = rows.map((r) => new Date(r.day).getTime());
  const dayMs = 24 * 60 * 60 * 1000;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = today.getTime();

  for (const day of days) {
    if (day === cursor || day === cursor - dayMs) {
      streak += 1;
      cursor = day - dayMs;
    } else {
      break;
    }
  }
  return streak;
}
