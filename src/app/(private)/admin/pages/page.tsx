import { listAdminPages } from "@/connections";
import { AdminPagesFeature } from "@/features/admin/pages";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.pagesTitle,
  description: messages.admin.pagesHint,
  path: PATHS.adminPages,
  index: false,
});

export default async function AdminPagesPage() {
  const pages = await listAdminPages();
  return <AdminPagesFeature pages={pages} />;
}
