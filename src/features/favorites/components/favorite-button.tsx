"use client";

import { HeartIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useFavoritesQuery } from "@/features/favorites/apis/use-favorites.query";
import { useToggleFavorite } from "@/features/favorites/apis/use-toggle-favorite.mutate";
import { useSessionUser } from "@/providers/session-provider";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function FavoriteButton({ propertyId }: { propertyId: string }) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { user, isPending } = useSessionUser();
  const favoritesQuery = useFavoritesQuery();
  const toggle = useToggleFavorite();
  const isFavorited =
    hasHydrated && (favoritesQuery.data?.ids.includes(propertyId) ?? false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated || isPending || !user) {
    return (
      <Button
        variant="secondary"
        size="icon"
        className="size-8 rounded-full bg-background/95 p-0 text-foreground shadow-sm ring-1 ring-foreground/10 [&_svg]:size-3.5"
        nativeButton={false}
        render={<Link href={PATHS.login} />}
        aria-label={messages.favorites.loginToSave}
      >
        <HeartIcon />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className="size-8 rounded-full bg-background/95 p-0 text-foreground shadow-sm ring-1 ring-foreground/10 [&_svg]:size-3.5"
      aria-pressed={isFavorited}
      aria-label={
        isFavorited ? messages.favorites.removeLabel : messages.favorites.addLabel
      }
      disabled={toggle.isPending || favoritesQuery.isLoading}
      onClick={() => {
        toggle.mutate(propertyId, {
          onError: (error) => {
            toast.error(error.message || messages.errors.description);
          },
        });
      }}
    >
      <HeartIcon className={isFavorited ? "fill-current" : undefined} />
    </Button>
  );
}
