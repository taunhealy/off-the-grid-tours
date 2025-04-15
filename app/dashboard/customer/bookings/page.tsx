import { Suspense } from "react";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { BookingsList } from "@/app/components/bookings/BookingsList";
import { BookingsListSkeleton } from "@/app/components/bookings/BookingsListSkeleton";
import { PageHeader } from "@/app/components/ui/page-header";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Bookings | Off The Grid",
  description: "View and manage your bookings",
};

async function getBookings(userId: string) {
  try {
    const bookings = await prisma.booking.findMany({
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
      orderBy: {
        checkInDate: "desc",
      },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      propertyName: booking.property.name,
      location: booking.property.location,
      checkIn: booking.checkInDate,
      checkOut: booking.checkOutDate,
      status: booking.status,
      totalPrice: booking.totalPrice,
      imageUrl: booking.property.images[0]?.url || "/images/placeholder.jpg",
    }));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export default async function CustomerBookingsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard/customer/bookings");
  }

  const bookings = await getBookings(session.user.id);

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="My Bookings"
        description="View and manage your current and past bookings"
      />

      <Suspense fallback={<BookingsListSkeleton />}>
        <BookingsList initialBookings={bookings} />
      </Suspense>
    </div>
  );
}
