import { redirect } from "next/navigation";

import type { CurrentUserWithMembership } from "@/types/database";

import { getCurrentUser } from "./get-current-user";

/**
 * Guard: requires an authenticated user with an organization membership.
 *
 * - No session → redirect to `/login`.
 * - Authenticated but no membership → redirect to `/onboarding`.
 *
 * Returns the user with non-null membership (type-narrowed).
 *
 * Use in Server Components and Server Actions inside any (app) route group.
 *
 * See: Projects/StockFlow/Auth-Flow.md
 */
export async function requireOrg(): Promise<CurrentUserWithMembership> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.membership) {
    redirect("/onboarding");
  }

  return user as CurrentUserWithMembership;
}
