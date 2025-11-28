import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";

export const bookTable = sqliteTable("book", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  summary: text("summary").notNull(),
  author: text("author"),
  totalPages: integer("totalPages").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
