import { amenityWriteSchema } from "@/contracts/amenity";
import {
  amenitySlugTaken,
  deleteAmenity,
  getAdminAmenity,
  updateAmenity,
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
  const data = await getAdminAmenity(id);

  if (!data) {
    return apiError("Amenity not found.", 404);
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
  const existing = await getAdminAmenity(id);

  if (!existing) {
    return apiError("Amenity not found.", 404);
  }

  const parsed = parseJsonBody(amenityWriteSchema, await request.json());

  if (parsed.response) {
    return parsed.response;
  }

  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : await uniqueSlug(parsed.data.name, (value) => amenitySlugTaken(value, id));

  if (await amenitySlugTaken(slug, id)) {
    return privateJson({ message: "Slug is already in use." }, { status: 409 });
  }

  const data = await updateAmenity(id, {
    name: parsed.data.name,
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
  const existing = await getAdminAmenity(id);

  if (!existing) {
    return apiError("Amenity not found.", 404);
  }

  await deleteAmenity(id);
  revalidateCatalog();
  return privateJson({ data: { id } });
}
