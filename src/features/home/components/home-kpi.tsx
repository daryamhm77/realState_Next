import { Container } from "@/components/layout";
import { homeKpiItems } from "@/messages";

export function HomeKpi() {
  return (
    <section className="bg-secondary text-foreground">
      <Container className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        {homeKpiItems.map((item) => (
          <div key={item.label} className="flex flex-col gap-1 text-center">
            <p className="font-heading text-3xl font-semibold sm:text-4xl">
              {item.value}
            </p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
