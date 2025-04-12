import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/app/components/ui/badge";
import { Calendar, MapPin, Clock, Bike } from "lucide-react";

export default async function TourGrid({
  searchParams,
}: {
  searchParams: {
    month?: string;
    bikeType?: string;
    difficulty?: string;
    duration?: string;
    search?: string;
  };
}) {
  // Build filter conditions based on search params
  const where: any = {
    published: true,
  };

  // Filter by difficulty if provided
  if (searchParams.difficulty) {
    where.difficulty = searchParams.difficulty;
  }

  // Filter by duration range if provided
  if (searchParams.duration) {
    const [min, max] = searchParams.duration.split("-");
    if (max) {
      where.duration = {
        gte: parseInt(min),
        lte: parseInt(max),
      };
    } else {
      // Handle "15+" case
      where.duration = {
        gte: parseInt(min.replace("+", "")),
      };
    }
  }

  // Filter by bike type if provided
  if (searchParams.bikeType) {
    where.motorcycles = {
      some: {
        motorcycle: {
          type: searchParams.bikeType,
        },
      },
    };
  }

  // Filter by month if provided
  if (searchParams.month) {
    const monthIndex = new Date(`${searchParams.month} 1, 2000`).getMonth();
    where.schedules = {
      some: {
        startDate: {
          gte: new Date(new Date().getFullYear(), monthIndex, 1),
          lt: new Date(new Date().getFullYear(), monthIndex + 1, 1),
        },
      },
    };
  }

  // Search by name or description if provided
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  // Fetch tours with filters
  const tours = await prisma.tour.findMany({
    where,
    include: {
      schedules: {
        take: 1,
        orderBy: {
          startDate: "asc",
        },
        where: {
          startDate: {
            gte: new Date(),
          },
        },
      },
      motorcycles: {
        include: {
          motorcycle: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (tours.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No tours found</h3>
        <p className="text-gray-500">
          Try adjusting your filters to find available tours.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <Link
          href={`/tours/${tour.id}`}
          key={tour.id}
          className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative h-48">
            {tour.images.length > 0 ? (
              <Image
                src={tour.images[0]}
                alt={tour.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            <Badge
              className="absolute top-3 right-3"
              variant={
                tour.difficulty === "EASY"
                  ? "outline"
                  : tour.difficulty === "MODERATE"
                  ? "secondary"
                  : tour.difficulty === "CHALLENGING"
                  ? "default"
                  : "destructive"
              }
            >
              {tour.difficulty
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
              {tour.name}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {tour.description}
            </p>

            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin size={16} className="mr-1" />
              <span>
                {tour.startLocation} to {tour.endLocation}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock size={16} className="mr-1" />
              <span>{tour.duration} days</span>
            </div>

            {tour.motorcycles.length > 0 && (
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Bike size={16} className="mr-1" />
                <span>
                  {tour.motorcycles
                    .slice(0, 2)
                    .map((tm) => tm.motorcycle.make + " " + tm.motorcycle.model)
                    .join(", ")}
                  {tour.motorcycles.length > 2 && "..."}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="font-semibold">
                From {formatCurrency(Number(tour.basePrice))}
              </div>

              {tour.schedules.length > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={16} className="mr-1" />
                  <span>
                    {new Date(tour.schedules[0].startDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
