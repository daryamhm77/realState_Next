import { notFound } from "next/navigation";

import { getAdminPage } from "@/connections";
import { PageEditor } from "@/features/admin/pages";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.admin.pageEditTitle,
  path: PATHS.adminPages,
  index: false,
});

export default async function AdminPageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getAdminPage(id);

  if (!page) {
    notFound();
  }

  return <PageEditor page={page} />;
}
