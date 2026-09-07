import { Building2Icon, HouseIcon, KeyRoundIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout";
import { messages } from "@/messages";
import { PATHS, propertiesPath } from "@/routes/paths";

const services = [
  {
    href: propertiesPath({ intent: "buy" }),
    title: messages.home.serviceBuyTitle,
    description: messages.home.serviceBuyDescription,
    icon: HouseIcon,
  },
  {
    href: propertiesPath({ intent: "rent" }),
    title: messages.home.serviceRentTitle,
    description: messages.home.serviceRentDescription,
    icon: KeyRoundIcon,
  },
  {
    href: propertiesPath({ intent: "commercial" }),
    title: messages.home.serviceCommercialTitle,
    description: messages.home.serviceCommercialDescription,
    icon: Building2Icon,
  },
  {
    href: PATHS.properties,
    title: messages.home.serviceBrowseTitle,
    description: messages.home.serviceBrowseDescription,
    icon: SearchIcon,
  },
] as const;

export function HomeCategories() {
  return (
    <section className="relative z-10 pt-10 pb-8 sm:pt-12">
      <Container>
        <div className="grid gap-0 overflow-hidden rounded-xl bg-background shadow-sm ring-1 ring-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.href + service.title}
                href={service.href}
                className="flex gap-3 border-foreground/10 p-5 transition-colors hover:bg-muted/60 sm:border-r sm:last:border-r-0 max-sm:border-b max-sm:last:border-b-0 lg:nth-2:border-r"
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-gold" />
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-semibold tracking-wide uppercase">
                    {service.title}
                  </span>
                  <span className="text-sm text-muted-foreground">{service.description}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
