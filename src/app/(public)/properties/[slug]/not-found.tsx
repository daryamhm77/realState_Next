import Link from "next/link";

import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export default function PropertyNotFound() {
  return (
    <Container className="flex flex-col items-start gap-4 py-20">
      <h1 className="font-heading text-3xl font-semibold">
        {messages.properties.emptyTitle}
      </h1>
      <p className="text-muted-foreground">{messages.properties.emptyDescription}</p>
      <Button nativeButton={false} render={<Link href={PATHS.properties} />}>
        {messages.home.featuredBrowse}
      </Button>
    </Container>
  );
}
