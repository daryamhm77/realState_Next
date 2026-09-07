import { AdminLayout } from "@/layouts";

export const dynamic = "force-dynamic";

export default function AdminGroupLayout({ children }: LayoutProps<"/">) {
  return <AdminLayout>{children}</AdminLayout>;
}
