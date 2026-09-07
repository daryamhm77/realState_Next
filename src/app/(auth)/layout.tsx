import { AuthLayout } from "@/layouts";

export const dynamic = "force-static";

export default function AuthGroupLayout({ children }: LayoutProps<"/">) {
  return <AuthLayout>{children}</AuthLayout>;
}
