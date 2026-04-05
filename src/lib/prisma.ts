import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/**
 * Supabase transaction pooler URLs need extra query params for Prisma (prepared statements / SSL).
 * Transaction mode uses port 6543 — either *.pooler.supabase.com or db.*.supabase.co (dashboard "Transaction").
 */
function isSupabaseTransactionPoolerUrl(u: URL): boolean {
  const host = u.hostname.toLowerCase();
  const port = u.port;
  if (host.includes("pooler.supabase.com")) return true;
  if (host.endsWith(".supabase.co") && port === "6543") return true;
  return false;
}

function normalizeSupabasePoolerUrl(trimmed: string): string {
  try {
    const u = new URL(trimmed);
    if (!isSupabaseTransactionPoolerUrl(u)) return trimmed;

    const p = u.searchParams;
    if (!p.has("pgbouncer")) p.set("pgbouncer", "true");
    if (!p.has("sslmode")) p.set("sslmode", "require");
    if (!p.has("connect_timeout")) p.set("connect_timeout", "30");
    if (!p.has("connection_limit")) p.set("connection_limit", "1");

    u.search = p.toString();
    return u.toString();
  } catch {
    return trimmed;
  }
}

/** Trim + normalize pooler URL; avoids failures from spaces or missing query params. */
function pooledDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed.length) return undefined;
  return normalizeSupabasePoolerUrl(trimmed);
}

const databaseUrl = pooledDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
