import "server-only";

import type { ZodType } from "zod";

import { getSession, isAdminRole } from "@/lib/session";
import { privateJson } from "@/lib/private-json";

export async function requireSessionApi() {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      response: privateJson({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, response: null };
}

export async function requireAdminApi() {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      response: privateJson({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!isAdminRole(session.user.role)) {
    return {
      session: null,
      response: privateJson({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { session, response: null };
}

export function parseJsonBody<T>(schema: ZodType<T>, data: unknown) {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return {
      data: null,
      response: privateJson(
        { message: "Invalid request", issues: parsed.error.flatten() },
        { status: 400 },
      ),
    };
  }

  return { data: parsed.data, response: null };
}

export function apiError(message: string, status = 400) {
  return privateJson({ message }, { status });
}
