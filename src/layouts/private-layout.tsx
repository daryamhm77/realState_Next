import { requireSession } from "@/lib/session";
import { QueryProvider } from "@/providers/query-provider";

export async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();

  return (
    <QueryProvider>
      <div className="flex min-h-full flex-1 flex-col">{children}</div>
    </QueryProvider>
  );
}
