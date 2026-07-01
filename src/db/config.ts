import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

console.log("turso db url : ", process.env.TURSO_DATABASE_URL);
console.log("turso auth token : ", process.env.TURSO_AUTH_TOKEN);
const turso = createClient({
  url:
    process.env.TURSO_DATABASE_URL! ??
    "libsql://aissa-bikashkumar.aws-ap-south-1.turso.io",
  authToken:
    process.env.TURSO_AUTH_TOKEN ??
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODA1MTE1MDEsImlkIjoiMDE5ZThlYzAtZTYwMS03Mzk0LTk2OGEtM2NkMGVjYzBlNWM5IiwicmlkIjoiM2JiZWY1ZTctOTE5ZS00MjExLWJjNDEtZjFmNjUxZTRiNzVmIn0.RW3_aB352UQ-6HKMx8CcvotU4M1BXgbsncyc2AOyTK2oSFOShOK6ThYjjYs4O2209yva1mdBv6SIKw_xWmNkAA",
});

export const db = drizzle(turso);
