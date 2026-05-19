import { z } from "zod";

/**
 * Server-only environment variables.
 * NEVER expose these in client code (no NEXT_PUBLIC_ prefix).
 */
const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Client-exposed environment variables.
 * Bundled into client JS — must not contain secrets.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_APP_NAME: z.string().default("StockFlow"),
});

const fullSchema = z.object({
  ...serverSchema.shape,
  ...clientSchema.shape,
});

const isServer = typeof window === "undefined";

/**
 * Explicit references are required so Next.js can statically inline
 * NEXT_PUBLIC_* vars into the client bundle. Reading `process.env[key]`
 * dynamically would break that inlining.
 */
const processEnv = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
};

const parsed = (isServer ? fullSchema : clientSchema).safeParse(processEnv);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".") || "(root)"}: ${issue.message}`);
  }
  throw new Error("Invalid environment variables — see src/lib/env.ts");
}

/**
 * Validated environment variables.
 *
 * On the client, only NEXT_PUBLIC_* keys are populated at runtime — server-only
 * keys will be `undefined`. The type signature exposes the full union for
 * developer ergonomics; reading server-only keys from a client component is a
 * mistake the team is expected to avoid (enforced by code review + ESLint).
 *
 * See: Projects/StockFlow/Environment.md
 */
export const env = parsed.data as z.infer<typeof fullSchema>;
