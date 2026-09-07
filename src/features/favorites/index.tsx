import { Container } from "@/components/layout";
import { listFavoriteProperties } from "@/connections";
import { FavoritesView } from "@/features/favorites/components/favorites-view";
import { getSession } from "@/lib/session";
import { messages } from "@/messages";

export async function FavoritesFeature() {
  const session = await getSession();
  const initialData = session
    ? await listFavoriteProperties(session.user.id)
    : { ids: [], items: [] };

  return (
    <section className="py-12 sm:py-16">
      <Container className="flex flex-col gap-8">
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {messages.favorites.title}
          </h1>
          <p className="text-muted-foreground">{messages.favorites.subtitle}</p>
        </div>
        <FavoritesView initialData={initialData} />
      </Container>
    </section>
  );
}
