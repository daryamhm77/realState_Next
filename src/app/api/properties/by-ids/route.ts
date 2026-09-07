import { NextResponse } from "next/server";

import { listPublishedPropertiesByIds } from "@/connections";
import { compareIdsQuerySchema } from "@/contracts/compare";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = compareIdsQuerySchema.safeParse({
    ids: url.searchParams.get("ids") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid request", issues: parsed.error.flatten() },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const data = await listPublishedPropertiesByIds(parsed.data.ids);

  return NextResponse.json(
    { data },
    { headers: { "Cache-Control": "no-store" } },
  );
}
