"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import {
  useCreatePage,
  useDeletePage,
  useUpdatePage,
} from "@/features/admin/pages/apis/use-page.mutate";
import { PageForm } from "@/features/admin/pages/components/page-form";
import type { CmsPage } from "@/features/admin/pages/types";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function PageEditor({ page }: { page?: CmsPage }) {
  const create = useCreatePage();
  const update = useUpdatePage(page?.id ?? "");
  const remove = useDeletePage();
  const isPending = create.isPending || update.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href={PATHS.adminPages} />}
            className="w-fit px-0"
          >
            {messages.admin.back}
          </Button>
          <h1 className="font-heading text-3xl font-semibold">
            {page ? messages.admin.pageEditTitle : messages.admin.pageCreateTitle}
          </h1>
        </div>
        {page ? (
          <DeleteRecordButton
            isPending={remove.isPending}
            onConfirm={() => remove.mutateAsync(page.id)}
          />
        ) : null}
      </div>

      <PageForm
        page={page}
        isPending={isPending}
        onSubmit={(values) =>
          page ? update.mutateAsync(values) : create.mutateAsync(values)
        }
      />
    </div>
  );
}
