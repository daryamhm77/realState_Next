import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import type { CmsPage } from "@/contracts/page";
import { isContactPageSlug } from "@/lib/cms";
import { getSiteUrl } from "@/lib/site-url";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function CmsPageFeature({ page }: { page: CmsPage }) {
  const url = new URL(PATHS.page(page.slug), getSiteUrl()).toString();
  const isContact = isContactPageSlug(page.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isContact ? "ContactPage" : "WebPage",
    name: page.title,
    description: page.body.slice(0, 160),
    url,
  };

  return (
    <article className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="flex max-w-3xl flex-col gap-6">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {page.title}
        </h1>
        <p className="whitespace-pre-wrap text-muted-foreground">{page.body}</p>
        {isContact ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">{messages.cms.contactHint}</p>
            <Button
              nativeButton={false}
              render={<a href={`mailto:${messages.site.email}`} />}
            >
              {messages.cms.contactMailto}
            </Button>
          </div>
        ) : null}
      </Container>
    </article>
  );
}
