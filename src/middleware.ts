import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js middleware — runs on every request that matches `config.matcher`.
 *
 * Responsibility: refresh the Supabase auth session cookie so Server
 * Components and Server Actions see an up-to-date session.
 *
 * Redirect logic for protected routes lives in layouts per route group,
 * NOT here. Middleware stays minimal to keep request latency low.
 *
 * See: Projects/StockFlow/Auth-Flow.md
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *   - _next/static (static files)
     *   - _next/image (image optimization)
     *   - favicon.ico
     *   - common image extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
