import { deletePropertyImage, setPropertyCover } from "@/connections";
import { apiError, requireAdminApi } from "@/lib/admin-api";
import { revalidateCatalog } from "@/lib/catalog-cache";
import { privateJson } from "@/lib/private-json";
import { removeStoredPhoto } from "@/lib/property-media-storage";

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

  await removeStoredPhoto(image.url);

  revalidateCatalog();
  return privateJson({ data: { id: imageId } });
}
