import { pool } from "@/lib/db";

export type BlockedCategory = {
  id: string;
  label: string;
  enabled: boolean;
  sites: string[];
};

export type BlockedSite = {
  id: string;
  domain: string;
};

export async function listCategories(userId: string): Promise<BlockedCategory[]> {
  const { rows } = await pool.query(
    `SELECT c.id, c.label, c.enabled,
            COALESCE(array_agg(s.domain) FILTER (WHERE s.id IS NOT NULL), '{}') AS sites
     FROM blocked_categories c
     LEFT JOIN blocked_sites s ON s.category_id = c.id
     WHERE c.user_id = $1
     GROUP BY c.id
     ORDER BY c.id`,
    [userId]
  );
  return rows;
}

export async function createCategory(userId: string, label: string, domains: string[]): Promise<BlockedCategory> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: catRows } = await client.query(
      `INSERT INTO blocked_categories (user_id, label, enabled) VALUES ($1, $2, true) RETURNING id, label, enabled`,
      [userId, label]
    );
    const category = catRows[0];

    for (const domain of domains) {
      await client.query(
        `INSERT INTO blocked_sites (user_id, category_id, domain) VALUES ($1, $2, $3)`,
        [userId, category.id, domain]
      );
    }

    await client.query("COMMIT");
    return { ...category, sites: domains };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function toggleCategory(userId: string, id: string): Promise<BlockedCategory | null> {
  const { rows } = await pool.query(
    `UPDATE blocked_categories SET enabled = NOT enabled
     WHERE id = $1 AND user_id = $2
     RETURNING id, label, enabled`,
    [id, userId]
  );
  return rows[0] || null;
}

export async function deleteCategory(userId: string, id: string): Promise<void> {
  await pool.query(`DELETE FROM blocked_categories WHERE id = $1 AND user_id = $2`, [id, userId]);
}

export async function listCustomSites(userId: string): Promise<BlockedSite[]> {
  const { rows } = await pool.query(
    `SELECT id, domain FROM blocked_sites WHERE user_id = $1 AND category_id IS NULL ORDER BY id`,
    [userId]
  );
  return rows;
}

export async function addCustomSite(userId: string, domain: string): Promise<BlockedSite> {
  const { rows } = await pool.query(
    `INSERT INTO blocked_sites (user_id, category_id, domain) VALUES ($1, NULL, $2) RETURNING id, domain`,
    [userId, domain]
  );
  return rows[0];
}

export async function deleteSite(userId: string, id: string): Promise<void> {
  await pool.query(`DELETE FROM blocked_sites WHERE id = $1 AND user_id = $2`, [id, userId]);
}
