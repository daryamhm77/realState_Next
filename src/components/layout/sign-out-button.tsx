"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function SignOutButton({
  className,
  onSignedOut,
}: {
  className?: string;
  onSignedOut?: () => void;
}) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className={className}
      onClick={async () => {
        await authClient.signOut();
        onSignedOut?.();
        router.push(PATHS.home);
        router.refresh();
      }}
    >
      {messages.nav.signOut}
    </Button>
  );
}
