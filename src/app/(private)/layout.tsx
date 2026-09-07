import { PrivateLayout } from "@/layouts";

export const dynamic = "force-dynamic";

export default function PrivateGroupLayout({ children }: LayoutProps<"/">) {
  return <PrivateLayout>{children}</PrivateLayout>;
}
