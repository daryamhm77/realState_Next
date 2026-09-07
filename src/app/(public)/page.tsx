import { HomeFeature } from "@/features/home";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: messages.home.metaTitle,
  description: messages.home.metaDescription,
  path: PATHS.home,
});

export default HomeFeature;
