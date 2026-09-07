import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { USER_ROLES } from "@/contracts/auth";
import { db } from "@/lib/db";
import { getSiteUrl } from "@/lib/site-url";
import { messages } from "@/messages";

function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function httpsOriginFromHost(host: string) {
  return `https://${host.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
}

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

function getAuthBaseURL() {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return httpsOriginFromHost(process.env.VERCEL_URL);
  }

  return process.env.BETTER_AUTH_URL ?? getSiteUrl();
}

function getTrustedOrigins(request?: Request) {
  const origins = new Set<string>([stripTrailingSlash(getSiteUrl())]);

  if (process.env.BETTER_AUTH_URL) {
    origins.add(stripTrailingSlash(process.env.BETTER_AUTH_URL));
  }

  for (const host of [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    if (host) {
      origins.add(httpsOriginFromHost(host));
    }
  }

  origins.add("https://real-state-next-*.vercel.app");

  const headerOrigin = request?.headers.get("origin");

  if (headerOrigin && isLoopbackOrigin(headerOrigin)) {
    origins.add(headerOrigin);
  }

  return [...origins];
}

export const auth = betterAuth({
  appName: messages.site.legalName,
  baseURL: getAuthBaseURL(),
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
