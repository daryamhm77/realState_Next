import {
  propertySearchParamsSchema,
  type PropertySearchParams,
} from "@/contracts/property";

const emptySearch = propertySearchParamsSchema.parse({});

export function parsePropertySearchParams(
  input: Record<string, string | string[] | undefined> | unknown,
): PropertySearchParams {
  const source =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(source)) {
    const scalar = Array.isArray(value) ? value[0] : value;

    if (scalar === undefined || scalar === "") {
      continue;
    }

    cleaned[key] = typeof scalar === "string" ? scalar.trim() : scalar;

    if (cleaned[key] === "") {
      delete cleaned[key];
    }
  }

  const parsed = propertySearchParamsSchema.safeParse(cleaned);
  return parsed.success ? parsed.data : emptySearch;
}

export function hasPropertyFilters(params: PropertySearchParams) {
  return Boolean(
    params.q ||
      params.intent ||
      params.category ||
      params.minPrice != null ||
      params.maxPrice != null ||
      params.beds != null ||
      params.baths != null ||
      params.page > 1,
  );
}
