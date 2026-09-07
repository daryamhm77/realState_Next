import { listAdminAmenities } from "@/connections";
import { AdminAmenitiesFeature } from "@/features/admin/amenities";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.amenitiesTitle,
  description: messages.admin.amenitiesHint,
  path: PATHS.adminAmenities,
  index: false,
});

export default async function AdminAmenitiesPage() {
  const amenities = await listAdminAmenities();
  return <AdminAmenitiesFeature amenities={amenities} />;
}
