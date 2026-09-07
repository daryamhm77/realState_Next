import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { messages } from "../src/messages";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const amenitySeeds = [
  { name: "Parking", slug: "parking" },
  { name: "Pool", slug: "pool" },
  { name: "Garden", slug: "garden" },
  { name: "Gym", slug: "gym" },
  { name: "Fireplace", slug: "fireplace" },
  { name: "Air conditioning", slug: "air-conditioning" },
  { name: "Laundry", slug: "laundry" },
  { name: "Security", slug: "security" },
] as const;

async function main() {
  const categories = await Promise.all(
    Object.values(messages.categories).map((category) =>
      db.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
        },
        create: {
          name: category.name,
          slug: category.slug,
          description: category.description,
        },
      }),
    ),
  );

  const amenities = await Promise.all(
    amenitySeeds.map((amenity) =>
      db.amenity.upsert({
        where: { slug: amenity.slug },
        update: { name: amenity.name },
        create: amenity,
      }),
    ),
  );

  const bySlug = Object.fromEntries(
    categories.map((category) => [category.slug, category.id]),
  );
  const amenityBySlug = Object.fromEntries(
    amenities.map((amenity) => [amenity.slug, amenity.id]),
  );

  const properties = [
    {
      title: "Hancock Park Family Residence",
      slug: "hancock-park-family-residence",
      description:
        "A sunlit family home on a quiet Hancock Park street, with a chef's kitchen, formal dining room, and a backyard made for weekends.",
      address: "312 N Highland Ave",
      city: "Los Angeles",
      dealType: "SALE" as const,
      useType: "RESIDENTIAL" as const,
      beds: 4,
      baths: 3,
      sqft: 2860,
      featured: true,
      published: true,
      categoryId: bySlug.house,
      amenityIds: [
        amenityBySlug.parking,
        amenityBySlug.garden,
        amenityBySlug.fireplace,
        amenityBySlug.laundry,
      ],
      amount: 1_250_000,
      period: "TOTAL" as const,
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Wilshire Corridor Skyline Condo",
      slug: "wilshire-corridor-skyline-condo",
      description:
        "A high-floor condominium with west-facing glass, a renovated kitchen, and building amenities a short walk from museums and dining.",
      address: "10580 Wilshire Blvd",
      city: "Los Angeles",
      dealType: "RENT" as const,
      useType: "RESIDENTIAL" as const,
      beds: 2,
      baths: 2,
      sqft: 1420,
      featured: true,
      published: true,
      categoryId: bySlug.condo,
      amenityIds: [
        amenityBySlug.parking,
        amenityBySlug.gym,
        amenityBySlug["air-conditioning"],
        amenityBySlug.security,
      ],
      amount: 3500,
      period: "MONTHLY" as const,
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Melrose Creative Office",
      slug: "melrose-creative-office",
      description:
        "A street-facing commercial suite with polished concrete, storefront glass, and a private conference room for a growing studio.",
      address: "7408 Melrose Ave",
      city: "Los Angeles",
      dealType: "SALE" as const,
      useType: "COMMERCIAL" as const,
      beds: null,
      baths: 2,
      sqft: 3200,
      featured: true,
      published: true,
      categoryId: bySlug.commercial,
      amenityIds: [amenityBySlug.parking, amenityBySlug.security],
      amount: 2_150_000,
      period: "TOTAL" as const,
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Silver Lake Hillside Lot",
      slug: "silver-lake-hillside-lot",
      description:
        "A buildable hillside parcel with city-light views and utilities at the street. Ready for an architect-led residence.",
      address: "2218 Micheltorena St",
      city: "Los Angeles",
      dealType: "SALE" as const,
      useType: "RESIDENTIAL" as const,
      beds: null,
      baths: null,
      sqft: 7200,
      featured: false,
      published: true,
      categoryId: bySlug.land,
      amenityIds: [],
      amount: 875_000,
      period: "TOTAL" as const,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Pasadena Craftsman Rental",
      slug: "pasadena-craftsman-rental",
      description:
        "A restored Craftsman with original millwork, a wraparound porch, and a garden that stays green most of the year.",
      address: "468 S Oakland Ave",
      city: "Pasadena",
      dealType: "RENT" as const,
      useType: "RESIDENTIAL" as const,
      beds: 3,
      baths: 2,
      sqft: 1980,
      featured: false,
      published: true,
      categoryId: bySlug.house,
      amenityIds: [
        amenityBySlug.parking,
        amenityBySlug.garden,
        amenityBySlug.fireplace,
      ],
      amount: 4200,
      period: "MONTHLY" as const,
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Santa Monica Beach Condo",
      slug: "santa-monica-beach-condo",
      description:
        "An ocean-breeze condo two blocks from the sand, with an open living room and a balcony for evening light.",
      address: "201 Ocean Ave",
      city: "Santa Monica",
      dealType: "SALE" as const,
      useType: "RESIDENTIAL" as const,
      beds: 2,
      baths: 2,
      sqft: 1180,
      featured: false,
      published: true,
      categoryId: bySlug.condo,
      amenityIds: [
        amenityBySlug.parking,
        amenityBySlug.pool,
        amenityBySlug.gym,
        amenityBySlug["air-conditioning"],
      ],
      amount: 1_145_000,
      period: "TOTAL" as const,
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    },
  ];

  const pages = [
    {
      title: messages.nav.about,
      slug: "about",
      navPlacement: "HEADER" as const,
      body: "Homeland is a single-agency brokerage. We publish every home we represent — for sale and for rent — so you can browse with confidence.\n\nOur team works in the neighborhoods we know best, from Hancock Park residences to Santa Monica condos and commercial suites across Los Angeles.",
    },
    {
      title: messages.nav.services,
      slug: "services",
      navPlacement: "HEADER" as const,
      body: "We help buyers, renters, and owners through every step: finding the right property, comparing listings, and closing with a team that already knows the home.\n\nEvery listing on this site is published by our agency. Search the catalog, save favorites, and compare up to three homes side by side.",
    },
    {
      title: messages.nav.contact,
      slug: "contact",
      navPlacement: "HEADER" as const,
      body: `Tell us what you are looking for. Email our team and we will help you find the right property.\n\nWe are at ${messages.site.address}.`,
    },
  ];

  for (const page of pages) {
    await db.page.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        body: page.body,
        navPlacement: page.navPlacement,
        published: true,
      },
      create: {
        title: page.title,
        slug: page.slug,
        body: page.body,
        navPlacement: page.navPlacement,
        published: true,
      },
    });
  }

  for (const listing of properties) {
    await db.property.upsert({
      where: { slug: listing.slug },
      update: {
        title: listing.title,
        description: listing.description,
        address: listing.address,
        city: listing.city,
        dealType: listing.dealType,
        useType: listing.useType,
        beds: listing.beds,
        baths: listing.baths,
        sqft: listing.sqft,
        featured: listing.featured,
        published: listing.published,
        categoryId: listing.categoryId,
        amenities: {
          set: listing.amenityIds.map((id) => ({ id })),
        },
      },
      create: {
        title: listing.title,
        slug: listing.slug,
        description: listing.description,
        address: listing.address,
        city: listing.city,
        dealType: listing.dealType,
        useType: listing.useType,
        beds: listing.beds,
        baths: listing.baths,
        sqft: listing.sqft,
        featured: listing.featured,
        published: listing.published,
        categoryId: listing.categoryId,
        amenities: {
          connect: listing.amenityIds.map((id) => ({ id })),
        },
        images: {
          create: {
            url: listing.image,
            alt: listing.title,
            sort: 0,
            isCover: true,
          },
        },
        prices: {
          create: {
            amount: listing.amount,
            currency: "USD",
            period: listing.period,
            effectiveFrom: new Date(),
            isCurrent: true,
          },
        },
      },
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
