"use client";

import Image from "next/image";
import { useState } from "react";

import type { PropertyImage } from "@/contracts/property";
import { messages } from "@/messages";

export function PropertyGallery({
  title,
  images,
}: {
  title: string;
  images: PropertyImage[];
}) {
  const [activeId, setActiveId] = useState(images[0]?.id);
  const active = images.find((image) => image.id === activeId) ?? images[0];

  if (!active) {
    return <div className="aspect-4/3 rounded-xl bg-muted" />;
  }

  return (
    <div className="flex flex-col gap-3" aria-label={messages.properties.galleryLabel}>
      <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
        <Image
          src={active.url}
          alt={active.alt || title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveId(image.id)}
              className="relative aspect-square overflow-hidden rounded-lg ring-1 ring-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-pressed={image.id === active.id}
            >
              <Image
                src={image.url}
                alt={image.alt || title}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
