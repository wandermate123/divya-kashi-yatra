import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Supabase transaction pooler URLs need query params for pooled mode + SSL.
 * Port 6543 — host may be db.*.supabase.co or *.pooler.supabase.com (see Supabase Connect → Transaction).
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

function databaseConnectionString(): string {
  const raw = process.env.DATABASE_URL;
  if (typeof raw !== "string") {
    throw new Error(
      "DATABASE_URL is missing. In Vercel → Settings → Environment Variables, add it for Production and redeploy.",
    );
  }
  const trimmed = raw.trim();
  if (!trimmed.length) {
    throw new Error(
      "DATABASE_URL is empty. In Vercel → Settings → Environment Variables, set a non-empty value and redeploy.",
    );
  }
  return normalizeSupabasePoolerUrl(trimmed);
}

function createPrismaClient(): PrismaClient {
  const connectionString = databaseConnectionString();
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/** Reuse one client per serverless instance (warm invocation). */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
