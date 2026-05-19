/**
 * Prisma client singleton for the KEPlans API.
 * Uses the Neon serverless driver via @prisma/adapter-neon (required for Prisma 7+).
 */
import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Neon WebSocket driver (needed outside Vercel Edge)
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add your Neon PostgreSQL connection string to .env"
  );
}

const adapter = new PrismaNeon({ connectionString });

/** Shared Prisma client — import this in controllers and middleware */
export const prisma = new PrismaClient({ adapter });
