import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { addPropertyImage, getAdminProperty } from "@/connections";
import { apiError, requireAdminApi } from "@/lib/admin-api";
import { revalidateCatalog } from "@/lib/catalog-cache";
import { privateJson } from "@/lib/private-json";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

const MAX_BYTES = 5 * 1024 * 1024;

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

  if (file.size > MAX_BYTES) {
    return apiError("Photos must be 5MB or smaller.");
  }

  const extension = ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES];

  if (!extension) {
    return apiError("Use a JPEG, PNG, or WebP photo.");
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  const alt = String(formData.get("alt") ?? "").slice(0, 160);
  const isCover = String(formData.get("isCover") ?? "") === "true";

  const data = await addPropertyImage({
    propertyId: id,
    url: `/uploads/${filename}`,
    alt,
    isCover: isCover || property.images.length === 0,
  });

  revalidateCatalog();
  return privateJson({ data }, { status: 201 });
}
