import { notFound } from "next/navigation";

import { getAdminCategory } from "@/connections";
import { CategoryEditor } from "@/features/admin/categories";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.categoryEditTitle,
  path: PATHS.adminCategories,
  index: false,
});

export default async function AdminCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getAdminCategory(id);

  if (!category) {
    notFound();
  }

  return <CategoryEditor category={category} />;
}
