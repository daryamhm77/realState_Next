"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/features/admin/categories/apis/use-category.mutate";
import { CategoryForm } from "@/features/admin/categories/components/category-form";
import type { Category } from "@/features/admin/categories/types";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function CategoryEditor({ category }: { category?: Category }) {
  const create = useCreateCategory();
  const update = useUpdateCategory(category?.id ?? "");
  const remove = useDeleteCategory();
  const isPending = create.isPending || update.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href={PATHS.adminCategories} />}
            className="w-fit px-0"
          >
            {messages.admin.back}
          </Button>
          <h1 className="font-heading text-3xl font-semibold">
            {category
              ? messages.admin.categoryEditTitle
              : messages.admin.categoryCreateTitle}
          </h1>
        </div>
        {category ? (
          <DeleteRecordButton
            isPending={remove.isPending}
            onConfirm={() => remove.mutateAsync(category.id)}
          />
        ) : null}
      </div>

      <CategoryForm
        category={category}
        isPending={isPending}
        onSubmit={(values) =>
          category ? update.mutateAsync(values) : create.mutateAsync(values)
        }
      />
    </div>
  );
}
