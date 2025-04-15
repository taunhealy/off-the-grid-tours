import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get the authenticated user
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "date-desc";

    // Build the query
    const query: any = {
      where: {
        userId,
      },
      include: {
        property: {
          select: {
            name: true,
            location: true,
            images: {
              take: 1,
            },
          },
        },
      },
      orderBy: {},
    };

    // Add status filter if provided
    if (status && status !== "all") {
      query.where.status = status;
    }

    // Add sorting
    if (sortBy === "date-desc") {
      query.orderBy.checkInDate = "desc";
    } else if (sortBy === "date-asc") {
      query.orderBy.checkInDate = "asc";
    } else if (sortBy === "price-desc") {
      query.orderBy.totalPrice = "desc";
    } else if (sortBy === "price-asc") {
      query.orderBy.totalPrice = "asc";
    }

    // Fetch bookings from database
    const bookings = await prisma.booking.findMany(query);

    // Transform the data to match the frontend requirements
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      propertyName: booking.property.name,
      location: booking.property.location,
      checkIn: booking.checkInDate,
      checkOut: booking.checkOutDate,
      status: booking.status,
      totalPrice: booking.totalPrice,
      imageUrl: booking.property.images[0]?.url || "/images/placeholder.jpg",
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
