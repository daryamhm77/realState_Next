"use client";

import Link from "next/link";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { Button } from "@/components/ui/button";
import { isAdminRole } from "@/contracts/auth";
import { useSessionUser } from "@/providers/session-provider";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

function GuestLinks({ layout }: { layout: "desktop" | "mobile" }) {
  return (
    <div className={layout === "mobile" ? "flex gap-2 pt-2" : "flex items-center gap-2"}>
      <Button
        variant={layout === "mobile" ? "outline" : "ghost"}
        nativeButton={false}
        render={<Link href={PATHS.login} />}
      >
        {messages.nav.login}
      </Button>
      <Button nativeButton={false} render={<Link href={PATHS.signup} />}>
        {messages.nav.signup}
      </Button>
    </div>
  );
}

export function HeaderAccount({ layout }: { layout: "desktop" | "mobile" }) {
  const { user, isPending, setUser } = useSessionUser();

  if (isPending || !user) {
    return <GuestLinks layout={layout} />;
  }

  return (
    <div
      className={
        layout === "mobile"
          ? "flex flex-col gap-3 pt-2"
          : "flex items-center gap-2"
      }
    >
      {isAdminRole(user.role) ? (
        <Button variant="ghost" nativeButton={false} render={<Link href={PATHS.admin} />}>
          {messages.admin.navLabel}
        </Button>
      ) : null}
      <p className="truncate text-sm font-medium">{user.name}</p>
      <SignOutButton
        className={layout === "mobile" ? "w-full justify-start" : undefined}
        onSignedOut={() => setUser(null)}
      />
    </div>
  );
}
