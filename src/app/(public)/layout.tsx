import { PublicLayout } from "@/layouts";

export default function PublicGroupLayout({ children }: LayoutProps<"/">) {
  return <PublicLayout>{children}</PublicLayout>;
}
