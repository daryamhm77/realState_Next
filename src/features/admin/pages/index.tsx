import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CmsPage } from "@/contracts/page";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

const placementLabel = {
  NONE: messages.admin.navNone,
  HEADER: messages.admin.navHeader,
  FOOTER: messages.admin.navFooter,
} as const;

export function AdminPagesFeature({ pages }: { pages: CmsPage[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold">
            {messages.admin.pagesTitle}
          </h1>
          <p className="text-muted-foreground">{messages.admin.pagesHint}</p>
        </div>
        <Button nativeButton={false} render={<Link href={PATHS.adminPageNew} />}>
          {messages.admin.create}
        </Button>
      </div>

      {pages.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>{messages.admin.pagesEmpty}</EmptyTitle>
            <EmptyDescription>{messages.admin.pagesHint}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{messages.admin.pageTitleLabel}</TableHead>
              <TableHead>{messages.admin.slugLabel}</TableHead>
              <TableHead>{messages.admin.pageNavLabel}</TableHead>
              <TableHead>{messages.admin.publishedLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <Link
                    href={PATHS.adminPage(page.id)}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {page.title}
                  </Link>
                </TableCell>
                <TableCell>{page.slug}</TableCell>
                <TableCell>{placementLabel[page.navPlacement]}</TableCell>
                <TableCell>
                  {page.published
                    ? messages.admin.statusPublished
                    : messages.admin.statusDraft}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export { PageEditor } from "@/features/admin/pages/components/page-editor";
