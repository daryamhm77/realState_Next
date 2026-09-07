import { notFound } from "next/navigation";

import { getAdminAmenity } from "@/connections";
import { AmenityEditor } from "@/features/admin/amenities";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.amenityEditTitle,
  path: PATHS.adminAmenities,
  index: false,
});

export default async function AdminAmenityEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const amenity = await getAdminAmenity(id);

  if (!amenity) {
    notFound();
  }

  return <AmenityEditor amenity={amenity} />;
}
