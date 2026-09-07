import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { isAdminRole, USER_ROLES, type UserRole } from "@/contracts/auth";
import { auth } from "@/lib/auth";
import { PATHS } from "@/routes/paths";

export { isAdminRole };

export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect(PATHS.login);
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireSession();

  if (!isAdminRole(session.user.role)) {
    redirect(PATHS.home);
  }

  return session;
}

export function getUserRole(
  role: string | null | undefined,
): UserRole | null {
  const parsed = role === USER_ROLES.admin || role === USER_ROLES.customer;
  return parsed ? role : null;
}
