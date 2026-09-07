import { HouseIcon } from "lucide-react";
import Link from "next/link";

import { HeaderAccount } from "@/components/layout/header-account";
import { Container } from "@/components/layout/container";
import { NavLink } from "@/components/layout/nav-link";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

const primaryLinks = [
  { href: PATHS.home, label: messages.nav.home },
  { href: PATHS.properties, label: messages.nav.properties },
] as const;

const trailingLinks = [
  { href: PATHS.compare, label: messages.nav.compare },
  { href: PATHS.favorites, label: messages.nav.favorites },
] as const;

export type SiteNavPage = {
  title: string;
  slug: string;
};

export function SiteHeader({ pages = [] }: { pages?: SiteNavPage[] }) {
  const pageLinks = pages.map((page) => ({
    href: PATHS.page(page.slug),
    label: page.title,
  }));

  return (
    <header className="relative sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link
          href={PATHS.home}
          className="inline-flex items-center gap-2 font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          <HouseIcon className="size-5 shrink-0 translate-y-[0.12em] text-gold" />
          <span className="leading-none">{messages.site.name}</span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 text-xs font-medium tracking-[0.16em] uppercase md:flex"
        >
          {primaryLinks.map((item) => (
            <NavLink key={item.href + item.label} href={item.href}>
              {item.label}
            </NavLink>
          ))}

          {trailingLinks.map((item) => (
            <NavLink key={item.href + item.label} href={item.href}>
              {item.label}
            </NavLink>
          ))}

          {pageLinks.length > 0 ? (
            <details className="group relative">
              <summary className="cursor-pointer list-none text-foreground/80 outline-none underline-offset-8 marker:content-none hover:text-foreground hover:underline [&::-webkit-details-marker]:hidden">
                {messages.nav.pages}
              </summary>
              <div className="absolute top-full right-0 z-10 mt-2 min-w-40 rounded-lg border bg-background p-2 text-xs font-medium tracking-normal normal-case shadow-sm">
                {pageLinks.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="block rounded-md px-3 py-2 outline-none hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          ) : null}
        </nav>

        <div className="hidden md:block">
          <HeaderAccount layout="desktop" />
        </div>

        <details className="md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border px-3 py-1.5 text-sm font-medium outline-none [&::-webkit-details-marker]:hidden">
            {messages.nav.menu}
          </summary>
          <div className="absolute inset-x-0 top-full z-10 border-b bg-background shadow-sm">
            <Container className="flex flex-col gap-3 py-4 text-sm font-medium">
              {[...primaryLinks, ...trailingLinks, ...pageLinks].map((item) => (
                <Link key={`mobile-${item.href}-${item.label}`} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <HeaderAccount layout="mobile" />
            </Container>
          </div>
        </details>
      </Container>
    </header>
  );
}
