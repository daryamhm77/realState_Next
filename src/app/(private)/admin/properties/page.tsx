import { listAdminProperties } from "@/connections";
import { AdminPropertiesFeature } from "@/features/admin/properties";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.propertiesTitle,
  description: messages.admin.propertiesHint,
  path: PATHS.adminProperties,
  index: false,
});

export default async function AdminPropertiesPage() {
  const properties = await listAdminProperties();
  return <AdminPropertiesFeature properties={properties} />;
}
