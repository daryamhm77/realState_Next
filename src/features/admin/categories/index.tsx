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
import type { Category } from "@/contracts/category";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function AdminCategoriesFeature({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold">
            {messages.admin.categoriesTitle}
          </h1>
          <p className="text-muted-foreground">{messages.admin.categoriesHint}</p>
        </div>
        <Button nativeButton={false} render={<Link href={PATHS.adminCategoryNew} />}>
          {messages.admin.create}
        </Button>
      </div>

      {categories.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>{messages.admin.categoriesEmpty}</EmptyTitle>
            <EmptyDescription>{messages.admin.categoriesHint}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{messages.admin.nameLabel}</TableHead>
              <TableHead>{messages.admin.slugLabel}</TableHead>
              <TableHead>{messages.admin.descriptionLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Link
                    href={PATHS.adminCategory(category.id)}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {category.name}
                  </Link>
                </TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export { CategoryEditor } from "@/features/admin/categories/components/category-editor";
