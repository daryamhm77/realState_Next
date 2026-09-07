import { Container } from "@/components/layout";
import { CompareIsland } from "@/features/compare/components/compare-island";
import { messages } from "@/messages";

export function CompareFeature() {
  return (
    <section className="py-12 sm:py-16">
      <Container className="flex flex-col gap-8">
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {messages.compare.title}
          </h1>
          <p className="text-muted-foreground">{messages.compare.subtitle}</p>
        </div>
        <CompareIsland />
      </Container>
    </section>
  );
}
