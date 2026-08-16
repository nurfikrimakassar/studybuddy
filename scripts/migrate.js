// Dijalankan dari terminal lokal (bukan bagian dari serverless function):
//   npm run migrate
//
// Butuh POSTGRES_URL atau DATABASE_URL di .env.local — biasanya kamu isi
// dengan `vercel env pull .env.local` setelah menyambungkan Vercel Postgres
// storage ke project ini.

require("dotenv").config({ path: ".env.local" });
require("dotenv").config(); // fallback ke .env kalau .env.local tidak ada

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "[migrate] POSTGRES_URL / DATABASE_URL tidak ditemukan. Isi .env.local dulu (lihat .env.example)."
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
});

async function migrate() {
  const migrationsDir = path.join(__dirname, "..", "db", "migrations");
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`[migrate] Running ${file} ...`);
    await pool.query(sql);
    console.log(`[migrate] Done ${file}`);
  }

  await pool.end();
  console.log("[migrate] All migrations applied.");
}

migrate().catch((err) => {
  console.error("[migrate] Failed:", err);
  process.exit(1);
});
