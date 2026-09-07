import { favoriteToggleSchema } from "@/contracts/favorite";
import { listFavoriteProperties, toggleFavorite } from "@/connections";
import { parseJsonBody, requireSessionApi } from "@/lib/admin-api";
import { privateJson } from "@/lib/private-json";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireSessionApi();

  if (gate.response) {
    return gate.response;
  }

  const data = await listFavoriteProperties(gate.session.user.id);
  return privateJson({ data });
}

export async function POST(request: Request) {
  const gate = await requireSessionApi();

  if (gate.response) {
    return gate.response;
  }

  const parsed = parseJsonBody(favoriteToggleSchema, await request.json());

  if (parsed.response) {
    return parsed.response;
  }

  const result = await toggleFavorite(
    gate.session.user.id,
    parsed.data.propertyId,
  );

  if ("error" in result) {
    return privateJson({ message: "Property not found." }, { status: 404 });
  }

  return privateJson({ data: result });
}
