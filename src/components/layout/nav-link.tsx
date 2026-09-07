"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "pb-px text-foreground/80 outline-none underline-offset-8 hover:text-foreground",
        active ? "text-foreground underline" : "hover:underline",
      )}
    >
      {children}
    </Link>
  );
}
