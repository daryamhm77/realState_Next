import { FavoritesFeature } from "@/features/favorites";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.favorites.metaTitle,
  description: messages.favorites.metaDescription,
  path: PATHS.favorites,
  index: false,
});

export default FavoritesFeature;
