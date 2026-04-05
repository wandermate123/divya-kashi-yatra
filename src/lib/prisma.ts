import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import type { PoolConfig } from "pg";

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

/** `connection_limit` is for Prisma’s engine, not libpq — node-postgres can mis-handle it and trigger TLS errors (P1011). */
function stripNonPgUriParams(urlString: string): string {
  try {
    const u = new URL(urlString);
    u.searchParams.delete("connection_limit");
    return u.toString();
  } catch {
    return urlString;
  }
}

function normalizeSupabasePoolerUrl(trimmed: string): string {
  try {
    const u = new URL(trimmed);
    if (!isSupabaseTransactionPoolerUrl(u)) return trimmed;

    const strictTls =
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true" ||
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "1";

    const p = u.searchParams;
    if (!p.has("pgbouncer")) p.set("pgbouncer", "true");
    /**
     * node-postgres (non–libpq-compat): sslmode=require becomes `ssl: {}` → strict CA check → P1011 on many hosts.
     * sslmode=no-verify → encrypted + rejectUnauthorized: false (Supabase / Vercel–safe default).
     * Strict: DATABASE_SSL_REJECT_UNAUTHORIZED=true → verify-full.
     */
    p.set("sslmode", strictTls ? "verify-full" : "no-verify");
    if (!p.has("connect_timeout")) p.set("connect_timeout", "30");

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

function poolConfigForDatabaseUrl(urlString: string): PoolConfig {
  const connectionString = stripNonPgUriParams(urlString);

  return {
    connectionString,
    max: 1,
    connectionTimeoutMillis: 30_000,
    idleTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  };
}

function createPrismaClient(): PrismaClient {
  const connectionString = databaseConnectionString();
  const adapter = new PrismaPg(poolConfigForDatabaseUrl(connectionString));
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/** Reuse one client per serverless instance (warm invocation). */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
