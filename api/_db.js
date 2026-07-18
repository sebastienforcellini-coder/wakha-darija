import { neon } from "@neondatabase/serverless";

let sql;

/**
 * Client SQL Neon partagé entre les fonctions serverless.
 * DATABASE_URL est injectée automatiquement par l'intégration Vercel ↔ Neon
 * (Storage → ta base → Connect Project) — ne jamais la coder en dur.
 */
export function db() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL manquante — vérifie que l'intégration Neon est bien connectée à ce projet Vercel."
      );
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}
