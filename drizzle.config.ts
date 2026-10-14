import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const databaseUrl = process.env.NEON_DATABASE_URL;
if (!databaseUrl?.trim()) {
  throw new Error("Missing required environment variable: NEON_DATABASE_URL");
}

export default defineConfig({
  schema: "./src/lib/db-schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
