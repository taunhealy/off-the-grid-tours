import { Suspense } from "react";
import TourGrid from "@/app/components/tours/tour-grid";
import TourFilters from "@/app/components/tours/tour-filters";
import TourGridSkeleton from "@/app/components/tours/tour-grid-skeleton";

export const metadata = {
  title: "Motorcycle Tours | Adventure Rides",
  description:
    "Browse our selection of guided motorcycle tours across various terrains and difficulty levels.",
};

export default function ToursPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Access search params directly
  const month = searchParams.month as string;
  const bikeType = searchParams.bikeType as string;
  const difficulty = searchParams.difficulty as string;
  const duration = searchParams.duration as string;
  const search = searchParams.search as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Motorcycle Tours</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="w-full md:w-1/4">
          <TourFilters
            initialMonth={month}
            initialBikeType={bikeType}
            initialDifficulty={difficulty}
            initialDuration={duration}
            initialSearch={search}
          />
        </div>

        {/* Tour Grid */}
        <div className="w-full md:w-3/4">
          <Suspense fallback={<TourGridSkeleton />}>
            <TourGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
