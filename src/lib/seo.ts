import type { Metadata } from "next";

import { messages } from "@/messages";
import { getSiteUrl } from "@/lib/site-url";

type BuildPageMetadataInput = {
  title: string;
  description?: string;
  path: string;
  index?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  index = true,
}: BuildPageMetadataInput): Metadata {
  const canonical = path;
  const ogDescription = description ?? messages.site.description;

  return {
    title,
    description: ogDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: ogDescription,
      url: canonical,
      siteName: messages.site.legalName,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ogDescription,
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export function getMetadataBase() {
  return new URL(getSiteUrl());
}
