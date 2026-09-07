import { cmsPageWriteSchema } from "@/contracts/page";
import {
  createPage,
  listAdminPages,
  pageSlugTaken,
} from "@/connections";
import { parseJsonBody, requireAdminApi } from "@/lib/admin-api";
import { revalidatePages } from "@/lib/catalog-cache";
import { isReservedPageSlug } from "@/lib/cms";
import { privateJson } from "@/lib/private-json";
import { slugify, uniqueSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireAdminApi();

  if (gate.response) {
    return gate.response;
  }

  const data = await listAdminPages();
  return privateJson({ data });
}

export async function POST(request: Request) {
  const gate = await requireAdminApi();

  if (gate.response) {
    return gate.response;
  }

  const parsed = parseJsonBody(cmsPageWriteSchema, await request.json());

  if (parsed.response) {
    return parsed.response;
  }

  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : await uniqueSlug(
        parsed.data.title,
        async (value) => isReservedPageSlug(value) || pageSlugTaken(value),
      );

  if (isReservedPageSlug(slug)) {
    return privateJson({ message: "Slug is reserved." }, { status: 409 });
  }

  if (await pageSlugTaken(slug)) {
    return privateJson({ message: "Slug is already in use." }, { status: 409 });
  }

  const data = await createPage({
    title: parsed.data.title,
    slug,
    body: parsed.data.body,
    navPlacement: parsed.data.navPlacement,
    published: parsed.data.published,
  });

  revalidatePages(slug);
  return privateJson({ data }, { status: 201 });
}
