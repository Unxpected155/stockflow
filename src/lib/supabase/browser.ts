import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/**
 * Supabase client for browser / client components.
 *
 * Use in components marked with "use client". For server components and
 * server actions, use the server client instead.
 *
 * See: Projects/StockFlow/Auth-Flow.md
 */
export function createClient() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
