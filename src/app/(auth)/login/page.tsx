import { LoginFeature } from "@/features/auth";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const metadata = buildPageMetadata({
  title: messages.auth.loginMetaTitle,
  description: messages.auth.loginMetaDescription,
  path: PATHS.login,
  index: false,
});

export default LoginFeature;
