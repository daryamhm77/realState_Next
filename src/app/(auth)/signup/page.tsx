import { SignupFeature } from "@/features/auth";
import { buildPageMetadata } from "@/lib/seo";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export const metadata = buildPageMetadata({
  title: messages.auth.signupMetaTitle,
  description: messages.auth.signupMetaDescription,
  path: PATHS.signup,
  index: false,
});

export default SignupFeature;
