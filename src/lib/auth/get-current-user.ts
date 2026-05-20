import { createClient } from "@/lib/supabase/server";
import type { CurrentUser } from "@/types/database";

/**
 * Resolves the current authenticated user, their profile, and their
 * organization membership.
 *
 * Returns `null` if there is no valid session.
 *
 * Server-side only. Uses `supabase.auth.getUser()` (which validates with
 * the Supabase server) — NOT `getSession()`, which reads cookies without
 * server-side verification and is unsafe for authorization decisions.
 *
 * See: Projects/StockFlow/Auth-Flow.md
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Fetch profile + membership in parallel. Both may be null:
  //   - profile: should always exist due to the auth.users trigger, but
  //     guard against race conditions on first signup.
  //   - membership: null until the user completes onboarding.
  const [profileResult, membershipResult] = await Promise.all([
    supabase.from("profiles").select("id, full_name, avatar_url").eq("id", user.id).maybeSingle(),
    supabase
      .from("organization_members")
      .select("organization_id, role")
      .eq("profile_id", user.id)
      .maybeSingle(),
  ]);

  return {
    id: user.id,
    email: user.email ?? "",
    profile: profileResult.data,
    membership: membershipResult.data,
  };
}
