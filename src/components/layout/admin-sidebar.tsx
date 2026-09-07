import Link from "next/link";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { Separator } from "@/components/ui/separator";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

const adminLinks = [
  { href: PATHS.admin, label: messages.admin.navDashboard },
  { href: PATHS.adminCategories, label: messages.admin.navCategories },
  { href: PATHS.adminProperties, label: messages.admin.navProperties },
  { href: PATHS.adminAmenities, label: messages.admin.navAmenities },
  { href: PATHS.adminPages, label: messages.admin.navPages },
  { href: PATHS.adminUsers, label: messages.admin.navUsers },
] as const;

type AdminSidebarProps = {
  name: string;
  email: string;
};

export function AdminSidebar({ name, email }: AdminSidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex flex-col gap-1 px-5 py-6">
        <Link
          href={PATHS.admin}
          className="font-heading text-xl font-semibold tracking-tight"
        >
          {messages.site.name}
          <span aria-hidden="true">.</span>
        </Link>
        <p className="text-xs text-sidebar-foreground/70">
          {messages.admin.navLabel}
        </p>
      </div>

      <nav aria-label={messages.admin.navLabel} className="flex flex-1 flex-col gap-1 px-3">
        {adminLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-3 px-3 py-4">
        <Separator className="bg-sidebar-border" />
        <div className="px-3">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-sidebar-foreground/70">{email}</p>
        </div>
        <Link
          href={PATHS.home}
          className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {messages.admin.viewSite}
        </Link>
        <SignOutButton className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
      </div>
    </aside>
  );
}
