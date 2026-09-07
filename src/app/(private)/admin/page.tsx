import { AdminDashboardFeature } from "@/features/admin/dashboard";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.metaTitle,
  description: messages.admin.metaDescription,
  path: PATHS.admin,
  index: false,
});

export default AdminDashboardFeature;
