import {
  listPublishedCategories,
  searchPublishedProperties,
} from "@/connections";
import { PropertiesFeature } from "@/features/properties";
import { parsePropertySearchParams } from "@/lib/property-search";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parsePropertySearchParams(await searchParams);
  const path = params.q
    ? `${PATHS.properties}?q=${encodeURIComponent(params.q)}`
    : PATHS.properties;

  return buildPageMetadata({
    title: params.q
      ? `${messages.properties.searchTitle}: ${params.q}`
      : messages.properties.metaTitle,
    description: messages.properties.metaDescription,
    path,
  });
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parsePropertySearchParams(await searchParams);
  const emptyResult = {
    items: [],
    total: 0,
    page: params.page,
    pageSize: params.pageSize,
  };
  const [categories, initialData] = await Promise.all([
    listPublishedCategories().catch(() => []),
    searchPublishedProperties(params).catch(() => emptyResult),
  ]);

  return (
    <PropertiesFeature
      categories={categories}
      search={params}
      initialData={initialData}
    />
  );
}
