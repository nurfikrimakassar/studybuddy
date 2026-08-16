import { Pool } from "pg";

/**
 * Reads the standard Postgres connection string. When you provision
 * "Vercel Postgres" from the Storage tab, Vercel auto-injects POSTGRES_URL
 * (pooled, via PgBouncer) into your project's env vars — safe to use
 * directly from serverless functions since it's already pool-aware on the
 * database side. Falls back to DATABASE_URL for local/non-Vercel Postgres.
 */
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  // eslint-disable-next-line no-console
  console.warn(
    "[db] POSTGRES_URL / DATABASE_URL belum di-set — lihat .env.example."
  );
}

// A module-level singleton so warm serverless containers reuse the same
// small pool instead of opening new connections on every invocation. Keep
// `max` low: many concurrent function instances each hold their own pool,
// and Postgres (especially free-tier) has a limited connection ceiling.
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

export const pool =
  global._pgPool ??
  new Pool({
    connectionString,
    max: 3,
    ssl: connectionString?.includes("localhost") ? false : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}
