import Link from "next/link";

import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function HomeCta() {
  return (
    <section className="bg-secondary">
      <Container className="flex flex-col items-start justify-between gap-6 py-16 sm:flex-row sm:items-center">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            {messages.home.ctaTitle}
          </h2>
          <p className="text-muted-foreground">{messages.home.ctaSubtitle}</p>
        </div>
        <Button size="lg" nativeButton={false} render={<Link href={PATHS.contact} />}>
          {messages.home.ctaButton}
        </Button>
      </Container>
    </section>
  );
}
