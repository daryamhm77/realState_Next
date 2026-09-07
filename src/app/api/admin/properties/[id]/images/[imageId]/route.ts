import { unlink } from "node:fs/promises";
import path from "node:path";

import { deletePropertyImage, setPropertyCover } from "@/connections";
import { apiError, requireAdminApi } from "@/lib/admin-api";
import { revalidateCatalog } from "@/lib/catalog-cache";
import { privateJson } from "@/lib/private-json";

export const dynamic = "force-dynamic";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const gate = await requireAdminApi();

  if (gate.response) {
    return gate.response;
  }

  const { id, imageId } = await params;
  await setPropertyCover(id, imageId);
  revalidateCatalog();
  return privateJson({ data: { id: imageId, isCover: true } });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const gate = await requireAdminApi();

  if (gate.response) {
    return gate.response;
  }

  const { id, imageId } = await params;
  const image = await deletePropertyImage(id, imageId);

  if (!image) {
    return apiError("Photo not found.", 404);
  }

  if (image.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", image.url);

    try {
      await unlink(filePath);
    } catch {
      // The database row is already gone; a missing file is not fatal.
    }
  }

  revalidateCatalog();
  return privateJson({ data: { id: imageId } });
}
