import { cmsPageWriteSchema } from "@/contracts/page";
import {
  deletePage,
  getAdminPage,
  pageSlugTaken,
  updatePage,
} from "@/connections";
import { apiError, parseJsonBody, requireAdminApi } from "@/lib/admin-api";
import { revalidatePages } from "@/lib/catalog-cache";
import { isReservedPageSlug } from "@/lib/cms";
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
  const data = await getAdminPage(id);

  if (!data) {
    return apiError("Page not found.", 404);
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
  const existing = await getAdminPage(id);

  if (!existing) {
    return apiError("Page not found.", 404);
  }

  const parsed = parseJsonBody(cmsPageWriteSchema, await request.json());

  if (parsed.response) {
    return parsed.response;
  }

  const slug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : await uniqueSlug(
        parsed.data.title,
        async (value) => isReservedPageSlug(value) || pageSlugTaken(value, id),
      );

  if (isReservedPageSlug(slug)) {
    return privateJson({ message: "Slug is reserved." }, { status: 409 });
  }

  if (await pageSlugTaken(slug, id)) {
    return privateJson({ message: "Slug is already in use." }, { status: 409 });
  }

  const data = await updatePage(id, {
    title: parsed.data.title,
    slug,
    body: parsed.data.body,
    navPlacement: parsed.data.navPlacement,
    published: parsed.data.published,
  });

  revalidatePages(existing.slug);
  if (slug !== existing.slug) {
    revalidatePages(slug);
  }

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
  const existing = await getAdminPage(id);

  if (!existing) {
    return apiError("Page not found.", 404);
  }

  await deletePage(id);
  revalidatePages(existing.slug);
  return privateJson({ data: { id } });
}
