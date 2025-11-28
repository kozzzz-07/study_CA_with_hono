import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "src/infrastructure/adapters/orm/drizzle/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME || "", // node.js前提のツールのため、Deno.get.envは使えない
  },
});
