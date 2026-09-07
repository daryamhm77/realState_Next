import { AmenityEditor } from "@/features/admin/amenities";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.amenityCreateTitle,
  path: PATHS.adminAmenityNew,
  index: false,
});

export default function AdminAmenityNewPage() {
  return <AmenityEditor />;
}
