import { Suspense } from "react";

import { HomeCategories } from "@/features/home/components/home-categories";
import { HomeCta } from "@/features/home/components/home-cta";
import { HomeFeatured } from "@/features/home/components/home-featured";
import { HomeHero } from "@/features/home/components/home-hero";
import { HomeKpi } from "@/features/home/components/home-kpi";
import { HomeSectionSkeleton } from "@/features/home/components/home-section-skeleton";

export function HomeFeature() {
  return (
    <>
      <HomeHero />
      <HomeCategories />
      <Suspense fallback={<HomeSectionSkeleton />}>
        <HomeFeatured />
      </Suspense>
      <HomeKpi />
      <HomeCta />
    </>
  );
}
