import { amenityWriteSchema } from "@/contracts/amenity";
import {
  amenitySlugTaken,
  createAmenity,
  listAdminAmenities,
} from "@/connections";
import { parseJsonBody, requireAdminApi } from "@/lib/admin-api";
import { revalidateCatalog } from "@/lib/catalog-cache";
import { privateJson } from "@/lib/private-json";
import { slugify, uniqueSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireAdminApi();

  if (gate.response) {
    return gate.response;
  }

  const data = await listAdminAmenities();
  return privateJson({ data });
}

export async function POST(request: Request) {
  const gate = await requireAdminApi();

  if (gate.response) {
    return gate.response;
  }

  const parsed = parseJsonBody(amenityWriteSchema, await request.json());

  if (parsed.response) {
    return parsed.response;
  }

  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : await uniqueSlug(parsed.data.name, (value) => amenitySlugTaken(value));

  if (await amenitySlugTaken(slug)) {
    return privateJson({ message: "Slug is already in use." }, { status: 409 });
  }

  const data = await createAmenity({
    name: parsed.data.name,
    slug,
  });

  revalidateCatalog();
  return privateJson({ data }, { status: 201 });
}
