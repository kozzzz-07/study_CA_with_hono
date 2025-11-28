import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.ts";

const client = createClient({
  url: Deno.env.get("DB_FILE_NAME")!,
});

export const db = drizzle(client, { schema });
