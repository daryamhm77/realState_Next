import { categoryWriteSchema } from "@/contracts/category";
import {
  categorySlugTaken,
  deleteCategory,
  getAdminCategory,
  updateCategory,
} from "@/connections";
import { apiError, parseJsonBody, requireAdminApi } from "@/lib/admin-api";
import { revalidateCatalog } from "@/lib/catalog-cache";
import { privateJson } from "@/lib/private-json";
import { slugify, uniqueSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminApi();

  if (gate.response) {
    return gate.response;
  }

  const { id } = await params;
  const data = await getAdminCategory(id);

  if (!data) {
    return apiError("Category not found.", 404);
  }

  return privateJson({ data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminApi();

  if (gate.response) {
    return gate.response;
  }

  const { id } = await params;
  const existing = await getAdminCategory(id);

  if (!existing) {
    return apiError("Category not found.", 404);
  }

  const parsed = parseJsonBody(categoryWriteSchema, await request.json());

  if (parsed.response) {
    return parsed.response;
  }

  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : await uniqueSlug(parsed.data.name, (value) =>
        categorySlugTaken(value, id),
      );

  if (await categorySlugTaken(slug, id)) {
    return privateJson({ message: "Slug is already in use." }, { status: 409 });
  }

  const data = await updateCategory(id, {
    name: parsed.data.name,
    slug,
    description: parsed.data.description,
  });

  revalidateCatalog();
  return privateJson({ data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminApi();

  if (gate.response) {
    return gate.response;
  }

  const { id } = await params;
  const existing = await getAdminCategory(id);

  if (!existing) {
    return apiError("Category not found.", 404);
  }

  try {
    await deleteCategory(id);
  } catch {
    return apiError("Remove listings in this category before deleting it.", 409);
  }

  revalidateCatalog();
  return privateJson({ data: { id } });
}
