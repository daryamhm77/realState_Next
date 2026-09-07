import { listAdminCategories } from "@/connections";
import { AdminCategoriesFeature } from "@/features/admin/categories";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.categoriesTitle,
  description: messages.admin.categoriesHint,
  path: PATHS.adminCategories,
  index: false,
});

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();
  return <AdminCategoriesFeature categories={categories} />;
}
