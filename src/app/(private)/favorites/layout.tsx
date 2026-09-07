import { PublicLayout } from "@/layouts";

export const dynamic = "force-dynamic";

export default function FavoritesLayout({ children }: LayoutProps<"/">) {
  return <PublicLayout>{children}</PublicLayout>;
}
