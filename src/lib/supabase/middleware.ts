import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Supabase session refresh helper for Next.js middleware.
 *
 * Reads + refreshes the session cookie on every request. Redirect logic
 * (unauthenticated → /login, no-org → /onboarding, etc.) lives in layouts
 * per route group — middleware stays minimal to keep request latency low.
 *
 * See: Projects/StockFlow/Auth-Flow.md
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session if expired. Required for Server Components to see
  // the up-to-date session via cookies.
  await supabase.auth.getUser();

  return supabaseResponse;
}
