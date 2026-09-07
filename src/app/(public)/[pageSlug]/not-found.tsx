import Link from "next/link";

import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export default function CmsPageNotFound() {
  return (
    <Container className="flex flex-col items-start gap-4 py-20">
      <h1 className="font-heading text-3xl font-semibold">
        {messages.cms.notFoundTitle}
      </h1>
      <p className="text-muted-foreground">{messages.cms.notFoundDescription}</p>
      <Button nativeButton={false} render={<Link href={PATHS.home} />}>
        {messages.nav.home}
      </Button>
    </Container>
  );
}
