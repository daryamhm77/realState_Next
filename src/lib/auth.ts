import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { USER_ROLES } from "@/contracts/auth";
import { db } from "@/lib/db";
import { getSiteUrl } from "@/lib/site-url";
import { messages } from "@/messages";

function isLoopbackOrigin(origin: string) {
  try {
    const url = new URL(origin);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

function getTrustedOrigins(request?: Request) {
  const origins = new Set<string>([getSiteUrl()]);
  const headerOrigin = request?.headers.get("origin");

  if (headerOrigin && isLoopbackOrigin(headerOrigin)) {
    origins.add(headerOrigin);
  }

  return [...origins];
}

export const auth = betterAuth({
  appName: messages.site.legalName,
  baseURL: process.env.BETTER_AUTH_URL ?? getSiteUrl(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  user: {
    additionalFields: {
      role: {
        type: [USER_ROLES.customer, USER_ROLES.admin],
        required: true,
        defaultValue: USER_ROLES.customer,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        async before(user) {
          const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

          if (adminEmail && user.email.toLowerCase() === adminEmail) {
            return {
              data: {
                ...user,
                role: USER_ROLES.admin,
              },
            };
          }

          return { data: user };
        },
      },
    },
  },
  trustedOrigins: (request) => getTrustedOrigins(request),
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
