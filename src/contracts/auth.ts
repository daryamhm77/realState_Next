import { z } from "zod";

export const USER_ROLES = {
  customer: "customer",
  admin: "admin",
} as const;

export const userRoleSchema = z.enum([USER_ROLES.customer, USER_ROLES.admin]);

export function isAdminRole(
  role: string | null | undefined,
): role is typeof USER_ROLES.admin {
  return role === USER_ROLES.admin;
}

export const passwordSchema = z.string().min(8).max(128);

export const loginRequestSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export const signupRequestSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.email(),
  password: passwordSchema,
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;
