import { NextResponse } from "next/server";

import { searchPublishedProperties } from "@/connections";
import { parsePropertySearchParams } from "@/lib/property-search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = parsePropertySearchParams(
    Object.fromEntries(url.searchParams.entries()),
  );
  const data = await searchPublishedProperties(params);

  return NextResponse.json(
    { data },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
