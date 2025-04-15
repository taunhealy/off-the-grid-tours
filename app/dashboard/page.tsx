"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Tour } from "@/lib/types/tour";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardTabs } from "@/app/components/ui/dashboardtabs";
import { useRouter } from "next/navigation";

function DashboardSkeleton() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="h-8 w-48 bg-gray-200 rounded-md mb-6 animate-pulse"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="h-6 w-24 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-10 w-32 bg-gray-300 rounded-md"></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 w-32 bg-gray-200 rounded-md mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { data: session } = useSession();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Define tabs based on user role
  const getTabs = () => {
    const baseTabs = [{ id: "overview", label: "Overview" }];

    if (!session?.user?.role || session.user.role === "CUSTOMER") {
      return [
        ...baseTabs,
        { id: "bookings", label: "My Bookings" },
        { id: "profile", label: "Profile" },
      ];
    }

    if (session.user.role === "GUIDE") {
      return [
        ...baseTabs,
        { id: "my-tours", label: "My Tours" },
        { id: "schedule", label: "Schedule" },
        { id: "profile", label: "Profile" },
      ];
    }

    if (session.user.role === "ADMIN") {
      return [
        ...baseTabs,
        { id: "tours", label: "Tours" },
        { id: "users", label: "Users" },
        { id: "bookings", label: "Bookings" },
        { id: "motorcycles", label: "Motorcycles" },
      ];
    }

    return baseTabs;
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "overview") {
      setActiveTab(tabId);
      return;
    }

    // Navigate to the appropriate page based on role and tab
    const role = session?.user?.role?.toLowerCase() || "customer";
    if (role === "admin" || role === "guide" || role === "customer") {
      router.push(`/dashboard/${role}/${tabId}`);
    } else {
      router.push(`/dashboard/${tabId}`);
    }
  };

  useEffect(() => {
    async function fetchTours() {
      try {
        const response = await fetch("/api/tours");
        if (!response.ok) throw new Error("Failed to fetch tours");
        const data = await response.json();
        setTours(data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTours();
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-h2 mb-6 font-primary">
        Welcome, {session?.user?.name || "Rider"}
      </h1>

      <DashboardTabs
        tabs={getTabs()}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-h5 text-gray-500 mb-2 font-primary">
            Total Tours
          </h3>
          <p className="text-h3 font-primary">{tours.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-h5 text-gray-500 mb-2 font-primary">
            Upcoming Tours
          </h3>
          <p className="text-h3 font-primary">
            {tours.filter((tour) => tour.published).length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-h5 text-gray-500 mb-2 font-primary">
            Your Bookings
          </h3>
          <p className="text-h3 font-primary">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <h2 className="text-h4 mb-4 font-primary">Recent Tours</h2>

        {tours.length > 0 ? (
          <div className="space-y-4">
            {tours.slice(0, 5).map((tour) => (
              <Link
                href={`/tours/${tour.id}`}
                key={tour.id}
                className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-h5 font-primary">{tour.name}</h3>
                    <p className="text-gray-600 font-primary">
                      {tour.duration} days • {tour.distance} km
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 font-primary">
                      $
                      {typeof tour.basePrice === "number"
                        ? tour.basePrice.toFixed(2)
                        : parseFloat(tour.basePrice.toString()).toFixed(2)}
                    </span>
                    <svg
                      className="w-5 h-5 ml-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4 font-primary">
              No tours available yet
            </p>
            <Link
              href="/dashboard/tours"
              className="btn btn-primary font-primary"
            >
              Browse Tours
            </Link>
          </div>
        )}

        {tours.length > 5 && (
          <div className="mt-4 text-center">
            <Link
              href="/tours"
              className="text-blue-600 hover:text-blue-800 font-medium font-primary"
            >
              View All Tours
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
