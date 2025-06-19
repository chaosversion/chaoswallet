import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const wallets = sqliteTable(
  'wallets',
  {
    userId: text('user_id', { length: 24 }).notNull().primaryKey(),
    balance: integer('balance').notNull().default(0)
  },
  table => [index('idx_user_id').on(table.userId)]
);
