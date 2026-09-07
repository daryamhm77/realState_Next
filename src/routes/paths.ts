export const PATHS = {
  home: "/",
  properties: "/properties",
  property: (slug: string) => `/properties/${slug}`,
  compare: "/compare",
  page: (slug: string) => `/${slug}`,
  about: "/about",
  services: "/services",
  contact: "/contact",
  login: "/login",
  signup: "/signup",
  favorites: "/favorites",
  admin: "/admin",
  adminCategories: "/admin/categories",
  adminCategoryNew: "/admin/categories/new",
  adminCategory: (id: string) => `/admin/categories/${id}`,
  adminProperties: "/admin/properties",
  adminPropertyNew: "/admin/properties/new",
  adminProperty: (id: string) => `/admin/properties/${id}`,
  adminAmenities: "/admin/amenities",
  adminAmenityNew: "/admin/amenities/new",
  adminAmenity: (id: string) => `/admin/amenities/${id}`,
  adminPages: "/admin/pages",
  adminPageNew: "/admin/pages/new",
  adminPage: (id: string) => `/admin/pages/${id}`,
  adminUsers: "/admin/users",
  api: {
    adminCategories: "/api/admin/categories",
    adminCategory: (id: string) => `/api/admin/categories/${id}`,
    adminAmenities: "/api/admin/amenities",
    adminAmenity: (id: string) => `/api/admin/amenities/${id}`,
    adminProperties: "/api/admin/properties",
    adminProperty: (id: string) => `/api/admin/properties/${id}`,
    adminPropertyImages: (id: string) => `/api/admin/properties/${id}/images`,
    adminPropertyImage: (propertyId: string, imageId: string) =>
      `/api/admin/properties/${propertyId}/images/${imageId}`,
    adminPages: "/api/admin/pages",
    adminPage: (id: string) => `/api/admin/pages/${id}`,
    properties: "/api/properties",
    propertiesByIds: "/api/properties/by-ids",
    favorites: "/api/favorites",
  },
} as const;

export type PropertyIntent = "buy" | "rent" | "commercial";

export function propertiesPath(params?: {
  q?: string;
  intent?: PropertyIntent;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  page?: number;
}) {
  if (!params) {
    return PATHS.properties;
  }

  const search = new URLSearchParams();

  if (params.q) {
    search.set("q", params.q);
  }

  if (params.intent) {
    search.set("intent", params.intent);
  }

  if (params.category) {
    search.set("category", params.category);
  }

  if (params.minPrice != null) {
    search.set("minPrice", String(params.minPrice));
  }

  if (params.maxPrice != null) {
    search.set("maxPrice", String(params.maxPrice));
  }

  if (params.beds != null) {
    search.set("beds", String(params.beds));
  }

  if (params.baths != null) {
    search.set("baths", String(params.baths));
  }

  if (params.page && params.page > 1) {
    search.set("page", String(params.page));
  }

  const query = search.toString();
  return query ? `${PATHS.properties}?${query}` : PATHS.properties;
}
