import { PATHS } from "@/routes/paths";

export const CMS_CONTACT_SLUG = "contact";

const reservedPageSlugs = new Set(
  [
    PATHS.properties,
    PATHS.compare,
    PATHS.login,
    PATHS.signup,
    PATHS.favorites,
    PATHS.admin,
  ].map((path) => path.replace(/^\//, "")),
);

reservedPageSlugs.add("api");

export function isReservedPageSlug(slug: string) {
  return reservedPageSlugs.has(slug);
}

export function isContactPageSlug(slug: string) {
  return slug === CMS_CONTACT_SLUG;
}
