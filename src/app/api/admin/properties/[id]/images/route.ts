import { addPropertyImage, getAdminProperty } from "@/connections";
import { apiError, requireAdminApi } from "@/lib/admin-api";
import { revalidateCatalog } from "@/lib/catalog-cache";
import {
  MAX_PROPERTY_PHOTO_BYTES,
  photoExtensionForType,
  storePropertyPhoto,
} from "@/lib/property-media-storage";
import { privateJson } from "@/lib/private-json";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requireAdminApi();

  if (gate.response) {
    return gate.response;
  }

  const { id } = await params;
  const property = await getAdminProperty(id);

  if (!property) {
    return apiError("Property not found.", 404);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return apiError("A photo file is required.");
  }

  if (file.size > MAX_PROPERTY_PHOTO_BYTES) {
    return apiError("Photos must be 4.5MB or smaller.");
  }

  if (!photoExtensionForType(file.type)) {
    return apiError("Use a JPEG, PNG, or WebP photo.");
  }

  const alt = String(formData.get("alt") ?? "").slice(0, 160);
  const isCover = String(formData.get("isCover") ?? "") === "true";

  let url: string;

  try {
    url = await storePropertyPhoto(file, id);
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Could not store the photo.",
    );
  }

  const data = await addPropertyImage({
    propertyId: id,
    url,
    alt,
    isCover: isCover || property.images.length === 0,
  });

  revalidateCatalog();
  return privateJson({ data }, { status: 201 });
}
