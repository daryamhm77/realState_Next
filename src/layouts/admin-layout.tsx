import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { requireAdmin } from "@/lib/session";

export async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-full flex-1">
      <AdminSidebar name={session.user.name} email={session.user.email} />
      <main className="min-w-0 flex-1 bg-background p-6 sm:p-8">{children}</main>
      <Toaster />
    </div>
  );
}
