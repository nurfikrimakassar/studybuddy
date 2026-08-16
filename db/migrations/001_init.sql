-- Tahap 1: skema awal StudyBuddy
-- Dijalankan lewat: npm run migrate

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  google_access_token TEXT,
  google_refresh_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedule_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  tag TEXT,
  done BOOLEAN NOT NULL DEFAULT false,
  google_event_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_minutes INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS blocked_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS blocked_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blocked_categories(id) ON DELETE SET NULL,
  domain TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_schedule_items_user_date ON schedule_items(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_started ON pomodoro_sessions(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_blocked_sites_user ON blocked_sites(user_id);
