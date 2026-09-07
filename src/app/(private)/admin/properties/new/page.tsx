import { listAdminAmenities, listAdminCategories } from "@/connections";
import { PropertyEditor } from "@/features/admin/properties";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.propertyCreateTitle,
  path: PATHS.adminPropertyNew,
  index: false,
});

export default async function AdminPropertyNewPage() {
  const [categories, amenities] = await Promise.all([
    listAdminCategories(),
    listAdminAmenities(),
  ]);

  return <PropertyEditor categories={categories} amenities={amenities} />;
}
