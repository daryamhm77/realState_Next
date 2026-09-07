import { notFound } from "next/navigation";

import {
  getPublishedProperty,
  listPublishedPropertySlugs,
} from "@/connections";
import { PropertyDetailFeature } from "@/features/properties/detail";
import { buildPageMetadata } from "@/lib/seo";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-static";
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const properties = await listPublishedPropertySlugs();
    return properties.map((property) => ({ slug: property.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPublishedProperty(slug).catch(() => null);

  if (!property) {
    return buildPageMetadata({
      title: "Property",
      path: PATHS.property(slug),
      index: false,
    });
  }

  return buildPageMetadata({
    title: property.title,
    description: property.description.slice(0, 160),
    path: PATHS.property(property.slug),
  });
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPublishedProperty(slug).catch(() => null);

  if (!property) {
    notFound();
  }

  return <PropertyDetailFeature property={property} />;
}
