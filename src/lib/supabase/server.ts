import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 *
 * Uses cookie-based session storage via @supabase/ssr. Cookie writes from
 * inside a Server Component are silently ignored — session refresh happens
 * in the Next.js middleware.
 *
 * See: Projects/StockFlow/Auth-Flow.md
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll called from a Server Component context — ignored.
          // The Next.js middleware handles session refresh and cookie writes.
        }
      },
    },
  });
}
