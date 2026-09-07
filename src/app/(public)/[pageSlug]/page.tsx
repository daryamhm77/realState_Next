import { notFound } from "next/navigation";

import { getPublishedPage, listPublishedPageSlugs } from "@/connections";
import { CmsPageFeature } from "@/features/cms";
import { isReservedPageSlug } from "@/lib/cms";
import { buildPageMetadata } from "@/lib/seo";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-static";
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const pages = await listPublishedPageSlugs();
    return pages
      .filter((page) => !isReservedPageSlug(page.slug))
      .map((page) => ({ pageSlug: page.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageSlug: string }>;
}) {
  const { pageSlug } = await params;
  const page = await getPublishedPage(pageSlug).catch(() => null);

  if (!page) {
    return buildPageMetadata({
      title: "Page",
      path: PATHS.page(pageSlug),
      index: false,
    });
  }

  return buildPageMetadata({
    title: page.title,
    description: page.body.slice(0, 160),
    path: PATHS.page(page.slug),
  });
}

export default async function CmsPageRoute({
  params,
}: {
  params: Promise<{ pageSlug: string }>;
}) {
  const { pageSlug } = await params;

  if (isReservedPageSlug(pageSlug)) {
    notFound();
  }

  const page = await getPublishedPage(pageSlug).catch(() => null);

  if (!page) {
    notFound();
  }

  return <CmsPageFeature page={page} />;
}
