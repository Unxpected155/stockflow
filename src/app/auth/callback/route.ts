import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth + email-confirmation callback.
 *
 * Supabase redirects here with a `?code=...` parameter for:
 *   - Google OAuth sign-in / sign-up
 *   - Email confirmation links (signUp emailRedirectTo)
 *   - Password recovery (resetPasswordForEmail redirectTo) — handled separately
 *     since the recovery flow lands on `/reset-password`, not here.
 *
 * We exchange the code for a session, then route the user based on whether they
 * already have an organization membership.
 *
 * See: Projects/StockFlow/Auth-Flow.md § Sign Up Flow / Google OAuth.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
  }

  const user = await getCurrentUser();
  const target = user?.membership ? "/dashboard" : "/onboarding";
  return NextResponse.redirect(new URL(target, request.url));
}
