import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { del, put } from "@vercel/blob";

export const PROPERTY_PHOTO_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

/** Vercel serverless request bodies max out at 4.5MB. */
export const MAX_PROPERTY_PHOTO_BYTES = 4.5 * 1024 * 1024;

export function photoExtensionForType(mime: string) {
  return PROPERTY_PHOTO_TYPES[mime as keyof typeof PROPERTY_PHOTO_TYPES];
}

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isVercelBlobUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

async function storeOnDisk(file: File, filename: string) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}

export async function storePropertyPhoto(file: File, propertyId: string) {
  const extension = photoExtensionForType(file.type);

  if (!extension) {
    throw new Error("Use a JPEG, PNG, or WebP photo.");
  }

  const filename = `${randomUUID()}.${extension}`;

  if (hasBlobToken()) {
    const blob = await put(`properties/${propertyId}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Photo storage is not configured. Create a Blob store in the Vercel dashboard.",
    );
  }

  return storeOnDisk(file, filename);
}

export async function removeStoredPhoto(url: string) {
  if (isVercelBlobUrl(url)) {
    try {
      await del(url);
    } catch {
      // The database row is already gone; a missing blob is not fatal.
    }
    return;
  }

  if (!url.startsWith("/uploads/")) {
    return;
  }

  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // The database row is already gone; a missing file is not fatal.
  }
}

export async function removeStoredPhotos(urls: string[]) {
  await Promise.all(urls.map((url) => removeStoredPhoto(url)));
}
