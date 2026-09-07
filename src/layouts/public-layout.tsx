import { SiteFooter, SiteHeader } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import { listPublishedPages } from "@/connections";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  const pages = await listPublishedPages().catch(() => []);
  const headerPages = pages
    .filter((page) => page.navPlacement === "HEADER")
    .map((page) => ({ title: page.title, slug: page.slug }));
  const footerPages = pages
    .filter((page) => page.navPlacement === "FOOTER")
    .map((page) => ({ title: page.title, slug: page.slug }));

  return (
    <QueryProvider>
      <SessionProvider>
        <div className="flex min-h-full flex-1 flex-col">
          <SiteHeader pages={headerPages} />
          <main className="flex-1">{children}</main>
          <SiteFooter pages={footerPages} />
          <Toaster />
        </div>
      </SessionProvider>
    </QueryProvider>
  );
}
