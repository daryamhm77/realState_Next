import { propertyWriteSchema } from "@/contracts/property";
import {
  createProperty,
  listAdminProperties,
  propertySlugTaken,
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

  const data = await listAdminProperties();
  return privateJson({ data });
}

export async function POST(request: Request) {
  const gate = await requireAdminApi();

  if (gate.response) {
    return gate.response;
  }

  const parsed = parseJsonBody(propertyWriteSchema, await request.json());

  if (parsed.response) {
    return parsed.response;
  }

  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : await uniqueSlug(parsed.data.title, (value) => propertySlugTaken(value));

  if (await propertySlugTaken(slug)) {
    return privateJson({ message: "Slug is already in use." }, { status: 409 });
  }

  const data = await createProperty({
    ...parsed.data,
    slug,
  });

  revalidateCatalog();
  return privateJson({ data }, { status: 201 });
}
