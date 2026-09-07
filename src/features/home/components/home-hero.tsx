import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

const intents = [
  { value: "", label: messages.home.intentAll },
  { value: "buy", label: messages.home.intentBuy },
  { value: "rent", label: messages.home.intentRent },
  { value: "commercial", label: messages.home.intentCommercial },
] as const;

export function HomeHero() {
  return (
    <section className="relative isolate min-h-136 overflow-hidden text-white sm:min-h-160">
      <Image
        src="/images/hero-villa.jpg"
        alt={messages.home.heroImageAlt}
        fill
        priority
        className="object-cover object-[center_40%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/15" />

      <Container className="relative flex min-h-136 flex-col justify-end gap-8 pt-16 pb-28 sm:min-h-160 sm:pt-24 sm:pb-32">
        <div className="flex max-w-2xl flex-col gap-5">
          <p className="text-sm font-medium tracking-[0.22em] text-gold uppercase">
            {messages.home.heroEyebrow}
          </p>
          <h1 className="font-heading text-4xl leading-tight font-semibold sm:text-6xl">
            {messages.home.heroTitle}{" "}
            <span className="text-gold">{messages.home.heroTitleAccent}</span>.
          </h1>
          <p className="max-w-xl text-lg text-white/85">{messages.home.heroSubtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90"
              nativeButton={false}
              render={<Link href={PATHS.properties} />}
            >
              {messages.home.exploreCta}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/15 text-white hover:bg-white/25 hover:text-white"
              nativeButton={false}
              render={<Link href={PATHS.contact} />}
            >
              {messages.home.contactCta}
            </Button>
          </div>
        </div>
      </Container>

      <Container className="relative z-10 -mt-16 pb-0">
        <form
          action={PATHS.properties}
          method="get"
          className="grid gap-3 rounded-xl bg-background p-4 text-foreground shadow-lg ring-1 ring-foreground/10 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-end sm:p-5"
        >
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            {messages.home.intentBuy}
            <select
              name="intent"
              defaultValue=""
              className="h-11 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {intents.map((intent) => (
                <option key={intent.value || "all"} value={intent.value}>
                  {intent.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            {messages.home.searchLabel}
            <input
              id="home-search-q"
              name="q"
              type="search"
              className="h-11 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder={messages.home.searchPlaceholder}
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/90"
          >
            <SearchIcon className="size-4" />
            {messages.home.searchCta}
          </button>
        </form>
      </Container>
    </section>
  );
}
