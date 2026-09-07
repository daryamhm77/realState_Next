import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const handler = toNextJsHandler(auth);

function withPrivateCache(response: Response) {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET(request: Request) {
  return withPrivateCache(await handler.GET(request));
}

export async function POST(request: Request) {
  return withPrivateCache(await handler.POST(request));
}
