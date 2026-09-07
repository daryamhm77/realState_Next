import { CompareFeature } from "@/features/compare";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: messages.compare.metaTitle,
  description: messages.compare.metaDescription,
  path: PATHS.compare,
});

export default CompareFeature;
