import { prisma } from "@/app/lib/prisma";
import TourManagement from "@/app/components/tours/TourManagement";

export const metadata = {
  title: "Tour Management | Dashboard",
  description: "Manage motorcycle tours",
};

async function getTours() {
  try {
    return await prisma.tour.findMany({
      include: {
        schedules: true,
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
  } catch (error) {
    console.error("Error fetching tours:", error);
    return []; // Return empty array as fallback
  }
}

export default async function ToursPage() {
  const initialTours = await getTours();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-h1 mb-6">Tour Management</h1>
      <TourManagement initialTours={initialTours} />
    </div>
  );
}
