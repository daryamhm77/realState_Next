import { notFound } from "next/navigation";

import {
  getAdminProperty,
  listAdminAmenities,
  listAdminCategories,
} from "@/connections";
import { PropertyEditor } from "@/features/admin/properties";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.propertyEditTitle,
  path: PATHS.adminProperties,
  index: false,
});

export default async function AdminPropertyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property, categories, amenities] = await Promise.all([
    getAdminProperty(id),
    listAdminCategories(),
    listAdminAmenities(),
  ]);

  if (!property) {
    notFound();
  }

  return (
    <PropertyEditor
      property={property}
      categories={categories}
      amenities={amenities}
    />
  );
}
