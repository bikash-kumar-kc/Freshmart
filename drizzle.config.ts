import dotenv from "dotenv";

dotenv.config();

import type { Config } from "drizzle-kit";


console.log("turso_db_url",process.env.TURSO_DATABASE_URL);
console.log("turso_auth_token",process.env.TURSO_AUTH_TOKEN);

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
