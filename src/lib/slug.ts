export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "item";
}

export async function uniqueSlug(
  value: string,
  exists: (slug: string) => Promise<boolean>,
) {
  const root = slugify(value);

  if (!(await exists(root))) {
    return root;
  }

  let suffix = 2;

  while (await exists(`${root}-${suffix}`)) {
    suffix += 1;
  }

  return `${root}-${suffix}`;
}
