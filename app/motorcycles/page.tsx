import { Suspense } from "react";
import MotorcycleGrid from "@/app/components/motorcycles/motorcycle-grid";
import MotorcycleFilters from "@/app/components/motorcycles/motorcycle-filters";
import MotorcycleGridSkeleton from "@/app/components/motorcycles/motorcycle-grid-skeleton";

export const metadata = {
  title: "Motorcycles | Adventure Rides",
  description:
    "Explore our collection of motorcycles available for rent, from adventure bikes to cruisers.",
};

export default function MotorcyclesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Access search params directly
  const brand = searchParams.brand as string;
  const category = searchParams.category as string;
  const engineSize = searchParams.engineSize as string;
  const price = searchParams.price as string;
  const search = searchParams.search as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Motorcycles</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="w-full md:w-1/4">
          <MotorcycleFilters
            initialBrand={brand}
            initialCategory={category}
            initialEngineSize={engineSize}
            initialPrice={price}
            initialSearch={search}
          />
        </div>

        {/* Motorcycle Grid */}
        <div className="w-full md:w-3/4">
          <Suspense fallback={<MotorcycleGridSkeleton />}>
            <div>
              <MotorcycleGrid searchParams={searchParams} />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
