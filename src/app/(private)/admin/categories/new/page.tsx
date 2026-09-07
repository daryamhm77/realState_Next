import { CategoryEditor } from "@/features/admin/categories";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.categoryCreateTitle,
  path: PATHS.adminCategoryNew,
  index: false,
});

export default function AdminCategoryNewPage() {
  return <CategoryEditor />;
}
