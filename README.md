<p align="center">
  <img src="public/logo.png" alt="Homeland Real Estate" width="280" />
</p>

<h1 align="center">Homeland</h1>

<p align="center">
  A single-agency real estate site for browsing, comparing, and saving homes for sale and rent.
</p>

Homeland is a Next.js app for a brokerage that publishes every listing it represents. Guests can search the catalog, filter by buy / rent / commercial, and compare up to three homes. Signed-in customers can save favorites. Staff manage categories, listings, photos, amenities, and CMS pages from an admin panel.

---

## Features

- **Public catalog** — featured homes on the landing page, searchable listings, and property detail pages
- **Search and filters** — city, address, or listing name, plus buy / rent / commercial, category, price, beds, and baths
- **Compare** — add up to three listings; the selection stays on this device
- **Favorites** — save homes to a private list (requires an account)
- **Accounts** — email and password signup / login, with automatic sign-in after registration
- **Admin** — create and edit properties, media, categories, amenities, and site pages
- **CMS pages** — About, Services, Contact, and other published pages in the header or footer
- **SEO** — metadata, sitemap, robots, and server-rendered public HTML

---

## Tech stack

| Area | Tools |
| --- | --- |
| App | [Next.js](https://nextjs.org) 16 (App Router), [React](https://react.dev) 19, TypeScript |
| UI | [Tailwind CSS](https://tailwindcss.com) 4, [shadcn/ui](https://ui.shadcn.com), [Base UI](https://base-ui.com), [Lucide](https://lucide.dev) |
| Data | [PostgreSQL](https://www.postgresql.org), [Prisma](https://www.prisma.io) 7 |
| Auth | [Better Auth](https://www.better-auth.com) (email and password) |
| Forms and validation | [react-hook-form](https://react-hook-form.com), [Zod](https://zod.dev) |
| Client state | [TanStack Query](https://tanstack.com/query), [Zustand](https://zustand-demo.pmnd.rs) (compare list) |
| Tooling | ESLint, Docker Compose, `tsx` for Prisma seed |

---

## Getting started

**Requirements:** Node.js 20+, npm, and Docker (for Postgres).

```bash
cp .env.example .env
docker compose up -d
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `BETTER_AUTH_SECRET` in `.env` to a long random string. `ADMIN_EMAIL` is the address that receives the admin role on first signup.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run db:migrate` | Create / apply Prisma migrations |
| `npm run db:seed` | Seed categories, listings, and CMS pages |
| `npm run db:studio` | Open Prisma Studio |

---

## Project layout

```text
src/app/          routes (public, auth, private/admin, API)
src/features/     screens and feature UI
src/components/   layout and shared UI
src/connections/  server data access
src/contracts/    Zod schemas
src/lib/          auth, db, SEO helpers
prisma/           schema, migrations, seed
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for rendering, caching, and layering rules.
