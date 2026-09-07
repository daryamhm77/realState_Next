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
import { signupSchema } from "@/features/auth/schemas/signup";
import type { SignupInput } from "@/features/auth/types";
import { authClient } from "@/lib/auth-client";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function SignupForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupInput) {
    setFormError(null);

    try {
      const { data, error } = await authClient.signUp.email({
        name: values.name,
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
        <Field data-invalid={!!errors.name || undefined}>
          <FieldLabel htmlFor="signup-name">{messages.auth.nameLabel}</FieldLabel>
          <Input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder={messages.auth.namePlaceholder}
            aria-invalid={!!errors.name || undefined}
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.email || undefined}>
          <FieldLabel htmlFor="signup-email">{messages.auth.emailLabel}</FieldLabel>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder={messages.auth.emailPlaceholder}
            aria-invalid={!!errors.email || undefined}
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password || undefined}>
          <FieldLabel htmlFor="signup-password">
            {messages.auth.passwordLabel}
          </FieldLabel>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
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
        {messages.auth.signupSubmit}
      </Button>

      <p className="text-sm text-muted-foreground">
        {messages.auth.hasAccount}{" "}
        <Link
          href={PATHS.login}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {messages.auth.loginTitle}
        </Link>
      </p>
    </form>
  );
}
