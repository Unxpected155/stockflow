import { redirect } from "next/navigation";

import type { CurrentUserWithMembership, OrganizationRole } from "@/types/database";

import { requireOrg } from "./require-org";

/**
 * Guard: requires the current user's role to be one of the given roles.
 *
 * Builds on `requireOrg()` — same redirects apply for no session or no
 * membership. If membership exists but the role isn't in `roles`, redirects
 * to `/dashboard`.
 *
 * TODO: replace the dashboard redirect with a proper 403 page in Phase 5
 * (production polish).
 *
 * See: Projects/StockFlow/Auth-Flow.md, Projects/StockFlow/Permissions.md
 */
export async function requireRole(roles: OrganizationRole[]): Promise<CurrentUserWithMembership> {
  const user = await requireOrg();

  if (!roles.includes(user.membership.role)) {
    redirect("/dashboard");
  }

  return user;
}
