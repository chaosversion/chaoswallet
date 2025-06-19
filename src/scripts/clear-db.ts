import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";

// THIS DOESNT WORK, PLEASE DONT USE IT RN
export async function clearDb(): Promise<void> {
  const query = sql<string>`SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';
  `;

  const result = await db.run(query); // retrieve tables
  const tables = result.rows ?? result; // adjust based on your db client

  for (const table of tables) {
    const query = sql.raw(`TRUNCATE TABLE ${table.table_name} CASCADE;`);
    await db.run(query);
  }
}

clearDb();
