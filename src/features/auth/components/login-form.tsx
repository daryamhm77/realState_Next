"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { USER_ROLES } from "@/contracts/auth";
import { loginSchema } from "@/features/auth/schemas/login";
import type { LoginInput } from "@/features/auth/types";
import { authClient } from "@/lib/auth-client";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setFormError(null);

    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setFormError(error.message ?? messages.auth.genericError);
        return;
      }

      const destination =
        data?.user.role === USER_ROLES.admin ? PATHS.admin : PATHS.home;
      router.push(destination);
      router.refresh();
    } catch {
      setFormError(messages.auth.genericError);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FieldGroup>
        <Field data-invalid={!!errors.email || undefined}>
          <FieldLabel htmlFor="login-email">{messages.auth.emailLabel}</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder={messages.auth.emailPlaceholder}
            aria-invalid={!!errors.email || undefined}
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password || undefined}>
          <FieldLabel htmlFor="login-password">
            {messages.auth.passwordLabel}
          </FieldLabel>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder={messages.auth.passwordPlaceholder}
            aria-invalid={!!errors.password || undefined}
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>
      </FieldGroup>

      {formError ? <FieldError>{formError}</FieldError> : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
        {messages.auth.loginSubmit}
      </Button>

      <p className="text-sm text-muted-foreground">
        {messages.auth.noAccount}{" "}
        <Link
          href={PATHS.signup}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {messages.auth.signupTitle}
        </Link>
      </p>
    </form>
  );
}
