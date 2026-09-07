"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout";
import { messages } from "@/messages";

export default function PropertiesError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <Container className="flex flex-col items-start gap-4 py-20">
      <h1 className="font-heading text-3xl font-semibold">{messages.errors.title}</h1>
      <p className="text-muted-foreground">{messages.errors.description}</p>
      <Button onClick={() => retry()}>{messages.errors.retry}</Button>
    </Container>
  );
}
