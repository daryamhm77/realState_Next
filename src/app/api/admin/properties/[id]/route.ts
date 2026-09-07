import { propertyWriteSchema } from "@/contracts/property";
import {
  deleteProperty,
  getAdminProperty,
  propertySlugTaken,
  updateProperty,
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
  const data = await getAdminProperty(id);

  if (!data) {
    return apiError("Property not found.", 404);
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
  const existing = await getAdminProperty(id);

  if (!existing) {
    return apiError("Property not found.", 404);
  }

  const parsed = parseJsonBody(propertyWriteSchema, await request.json());

  if (parsed.response) {
    return parsed.response;
  }

  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : await uniqueSlug(parsed.data.title, (value) =>
        propertySlugTaken(value, id),
      );

  if (await propertySlugTaken(slug, id)) {
    return privateJson({ message: "Slug is already in use." }, { status: 409 });
  }

  const data = await updateProperty(id, {
    ...parsed.data,
    slug,
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
  const existing = await getAdminProperty(id);

  if (!existing) {
    return apiError("Property not found.", 404);
  }

  await deleteProperty(id);
  revalidateCatalog();
  return privateJson({ data: { id } });
}
