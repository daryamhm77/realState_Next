import Link from "next/link";

import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <header className="px-6 py-6">
        <Link
          href={PATHS.home}
          className="font-heading text-xl font-semibold tracking-tight text-navy"
        >
          {messages.site.name}
          <span aria-hidden="true">.</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        {children}
      </main>
    </div>
  );
}
