import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";

interface TourGridProps {
  searchParams: {
    month?: string;
    bikeType?: string;
    difficulty?: string;
    duration?: string;
    search?: string;
  };
}

export default async function TourGrid({ searchParams }: TourGridProps) {
  // Build filter conditions based on search params
  const where: any = {
    published: true,
  };

  // Apply search filter
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  // Apply difficulty filter
  if (searchParams.difficulty) {
    where.difficulty = searchParams.difficulty;
  }

  // Apply duration filter
  if (searchParams.duration) {
    const [min, max] = searchParams.duration.split("-").map(Number);
    where.duration = {
      gte: min || 1,
      lte: max || 999,
    };
  }

  // Apply bike type filter (requires joining with TourMotorcycle and Motorcycle)
  if (searchParams.bikeType) {
    where.motorcycles = {
      some: {
        motorcycle: {
          type: searchParams.bikeType,
        },
      },
    };
  }

  // Apply month filter (requires joining with TourSchedule)
  if (searchParams.month) {
    // Convert month name to number (1-12)
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const monthIndex = monthNames.indexOf(searchParams.month.toLowerCase());

    if (monthIndex !== -1) {
      const monthNumber = monthIndex + 1; // Convert to 1-based index
      where.schedules = {
        some: {
          startDate: {
            gte: new Date(new Date().getFullYear(), monthIndex, 1), // Use monthIndex (0-based)
            lt: new Date(new Date().getFullYear(), monthIndex + 1, 1), // Next month
          },
        },
      };
    }
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (tours.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600">No tours found</h3>
        <p className="mt-2 text-gray-500">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <Link href={`/tours/${tour.id}`} key={tour.id}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={tour.images[0] || "/images/placeholder-tour.jpg"}
                  alt={tour.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {tour.duration} days
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <h3 className="font-bold text-lg mb-1">{tour.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="capitalize">
                  {tour.difficulty.toLowerCase()}
                </Badge>
                <span className="text-sm text-gray-500">
                  {tour.startLocation} to {tour.endLocation}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {tour.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm">
                {tour.schedules.length > 0 ? (
                  <span>
                    Next:{" "}
                    {new Date(tour.schedules[0].startDate).toLocaleDateString()}
                  </span>
                ) : (
                  <span>No upcoming dates</span>
                )}
              </div>
              <div className="font-bold">
                ${Number(tour.basePrice).toLocaleString()}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
