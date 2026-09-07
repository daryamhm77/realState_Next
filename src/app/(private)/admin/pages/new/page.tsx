import { PageEditor } from "@/features/admin/pages";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.pageCreateTitle,
  path: PATHS.adminPageNew,
  index: false,
});

export default function AdminPageNewPage() {
  return <PageEditor />;
}
