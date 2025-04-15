"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardTabsNavigation } from "@/app/components/dashboard/dashboard-tabs-navigation";
import { useRouter } from "next/navigation";
import DashboardSkeleton from "@/app/components/dashboard/dashboard-skeleton";

export default function CustomerProfilePage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Define tabs based on user role
  const getTabs = () => {
    const userRole = session?.user?.role?.toLowerCase() || "customer";

    const baseTabs = [
      {
        id: "upcoming",
        label: "Upcoming Bookings",
        href: `/dashboard/${userRole}/bookings/upcoming`,
      },
      {
        id: "past",
        label: "Past Bookings",
        href: `/dashboard/${userRole}/bookings/past`,
      },
      {
        id: "profile",
        label: "Profile",
        href: `/dashboard/${userRole}/profile`,
      },
    ];

    switch (userRole) {
      case "admin":
        return [
          ...baseTabs,
          {
            id: "tours",
            label: "Manage Tours",
            href: "/dashboard/admin/tours",
          },
          { id: "users", label: "Users", href: "/dashboard/admin/users" },
          {
            id: "bookings",
            label: "All Bookings",
            href: "/dashboard/admin/bookings",
          },
          {
            id: "motorcycles",
            label: "Motorcycles",
            href: "/dashboard/admin/motorcycles",
          },
        ];
      case "guide":
        return [
          ...baseTabs,
          { id: "my-tours", label: "My Tours", href: "/dashboard/guide/tours" },
          {
            id: "schedule",
            label: "Schedule",
            href: "/dashboard/guide/schedule",
          },
        ];
      case "customer":
      default:
        return baseTabs;
    }
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "profile") {
      return; // Already on profile page
    }

    if (["upcoming", "past"].includes(tabId)) {
      router.push("/dashboard");
      return;
    }

    // Navigate to the appropriate page based on role and tab
    const role = session?.user?.role?.toLowerCase() || "customer";
    router.push(`/dashboard/${role}/${tabId}`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const bookingsResponse = await fetch("/api/bookings/user");

        if (!bookingsResponse.ok) throw new Error("Failed to fetch bookings");

        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-h2 mb-6 font-primary">
        Welcome, {session?.user?.name || "Rider"}
      </h1>

      <DashboardTabsNavigation
        tabs={getTabs()}
        activeTab="profile"
        onTabChange={handleTabChange}
      />

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <h2 className="text-h4 mb-6 font-primary">Your Profile</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-h5 mb-2 font-primary">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-primary">Name</p>
                <p className="font-primary">
                  {session?.user?.name || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-primary">Email</p>
                <p className="font-primary">
                  {session?.user?.email || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-primary">Role</p>
                <p className="font-primary capitalize">
                  {session?.user?.role?.toLowerCase() || "Customer"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-h5 mb-2 font-primary">Account Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-primary">
                  Total Bookings
                </p>
                <p className="text-h4 font-primary">{bookings.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-primary">
                  Upcoming Tours
                </p>
                <p className="text-h4 font-primary">
                  {
                    bookings.filter(
                      (booking) => new Date(booking.startDate) >= new Date()
                    ).length
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-primary">
                  Completed Tours
                </p>
                <p className="text-h4 font-primary">
                  {
                    bookings.filter((booking) => booking.status === "COMPLETED")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/profile/edit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-primary"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
