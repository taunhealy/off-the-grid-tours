import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        schedules: true,
        motorcycles: {
          include: {
            motorcycle: true,
          },
        },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const tour = await prisma.tour.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        duration: data.duration,
        distance: data.distance,
        startLocation: data.startLocation,
        endLocation: data.endLocation,
        maxParticipants: data.maxParticipants,
        basePrice: data.basePrice,
        published: data.published,
      },
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Delete related records first (due to foreign key constraints)
    await prisma.$transaction([
      prisma.tourMotorcycle.deleteMany({ where: { tourId: id } }),
      prisma.tourAccommodation.deleteMany({ where: { tourId: id } }),
      prisma.tourSchedule.deleteMany({ where: { tourId: id } }),
      prisma.tour.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}
