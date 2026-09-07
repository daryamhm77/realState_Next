import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/session";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

const dashboardLinks = [
  {
    href: PATHS.adminCategories,
    title: messages.admin.navCategories,
    description: messages.admin.categoriesHint,
  },
  {
    href: PATHS.adminProperties,
    title: messages.admin.navProperties,
    description: messages.admin.propertiesHint,
  },
  {
    href: PATHS.adminAmenities,
    title: messages.admin.navAmenities,
    description: messages.admin.amenitiesHint,
  },
  {
    href: PATHS.adminPages,
    title: messages.admin.navPages,
    description: messages.admin.pagesHint,
  },
  {
    href: PATHS.adminUsers,
    title: messages.admin.navUsers,
    description: messages.admin.usersHint,
  },
] as const;

export async function AdminDashboardFeature() {
  const session = await getSession();
  const name = session?.user.name;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          {messages.admin.greeting}
          {name ? `, ${name}` : ""}
        </p>
        <h1 className="font-heading text-3xl font-semibold">
          {messages.admin.dashboardTitle}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          {messages.admin.dashboardSubtitle}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardLinks.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl">
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
