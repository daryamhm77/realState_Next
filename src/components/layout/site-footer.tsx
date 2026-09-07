import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

const productLinks = [
  { href: PATHS.properties, label: messages.nav.properties },
  { href: PATHS.compare, label: messages.nav.compare },
  { href: PATHS.favorites, label: messages.nav.favorites },
] as const;

export type SiteFooterPage = {
  title: string;
  slug: string;
};

export function SiteFooter({ pages = [] }: { pages?: SiteFooterPage[] }) {
  const pageLinks = pages.map((page) => ({
    href: PATHS.page(page.slug),
    label: page.title,
  }));
  const footerLinks = [...productLinks, ...pageLinks];

  return (
    <footer className="bg-navy text-navy-foreground">
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">{messages.footer.aboutTitle}</p>
          <p className="font-heading text-2xl font-semibold">
            {messages.site.name}
            <span aria-hidden="true">.</span>
          </p>
          <p className="text-sm text-navy-foreground/80">{messages.footer.about}</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">{messages.footer.linksTitle}</p>
          <nav aria-label={messages.footer.linksTitle} className="flex flex-col gap-2 text-sm">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-navy-foreground/80 underline-offset-4 hover:text-navy-foreground hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold">{messages.footer.contactTitle}</p>
          <p>{messages.site.address}</p>
          <a className="underline-offset-4 hover:underline" href={`tel:${messages.site.phoneHref}`}>
            {messages.site.phone}
          </a>
          <a className="underline-offset-4 hover:underline" href={`mailto:${messages.site.email}`}>
            {messages.site.email}
          </a>
        </div>
      </Container>

      <Separator className="bg-navy-foreground/15" />

      <Container className="py-4 text-xs text-navy-foreground/70">
        © {new Date().getFullYear()} {messages.site.legalName}. {messages.footer.copyright}
      </Container>
    </footer>
  );
}
