"use client";

import { Button } from "@/components/ui/button";
import { messages } from "@/messages";

export default function AuthError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="flex max-w-md flex-col items-start gap-4">
      <h1 className="font-heading text-3xl font-semibold">{messages.errors.title}</h1>
      <p className="text-muted-foreground">{messages.errors.description}</p>
      <Button onClick={() => retry()}>{messages.errors.retry}</Button>
    </div>
  );
}
