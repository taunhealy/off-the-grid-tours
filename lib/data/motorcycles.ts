import { Motorcycle } from "@/lib/types/motorcycles";

// This would typically connect to your database or API
export async function fetchMotorcycles(filters: {
  [key: string]: string | string[] | undefined;
}): Promise<Motorcycle[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // This is mock data - in a real app, you'd fetch from a database
  const motorcycles: Motorcycle[] = [
    {
      id: "1",
      name: "BMW R 1250 GS",
      brand: "BMW",
      category: "Adventure",
      engineSize: "1254cc",
      pricePerDay: 180,
      imageUrl: "/images/motorcycles/bmw-r1250gs.jpg",
      description:
        "The ultimate adventure motorcycle for long-distance touring.",
    },
    {
      id: "2",
      name: "Honda Africa Twin",
      brand: "Honda",
      category: "Adventure",
      engineSize: "1084cc",
      pricePerDay: 160,
      imageUrl: "/images/motorcycles/honda-africa-twin.jpg",
      description:
        "Built for true adventure, with a powerful engine and comfortable riding position.",
    },
    // Add more motorcycles as needed
  ];

  // Filter the motorcycles based on the provided filters
  return motorcycles.filter((motorcycle) => {
    // Filter by brand
    if (
      filters.brand &&
      filters.brand !== "All" &&
      motorcycle.brand !== filters.brand
    ) {
      return false;
    }

    // Filter by category
    if (
      filters.category &&
      filters.category !== "All" &&
      motorcycle.category !== filters.category
    ) {
      return false;
    }

    // Filter by engine size (this would need more logic for ranges)
    if (filters.engineSize && filters.engineSize !== "All") {
      // Simplified example - you'd need to parse the ranges properly
      if (
        filters.engineSize === "Under 500cc" &&
        parseInt(motorcycle.engineSize) >= 500
      ) {
        return false;
      }
      // Add other engine size range checks
    }

    // Filter by price (this would need more logic for ranges)
    if (filters.price && filters.price !== "All") {
      // Simplified example - you'd need to parse the ranges properly
      if (filters.price === "Under $100" && motorcycle.pricePerDay >= 100) {
        return false;
      }
      // Add other price range checks
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = String(filters.search).toLowerCase();
      return (
        motorcycle.name.toLowerCase().includes(searchTerm) ||
        motorcycle.brand.toLowerCase().includes(searchTerm) ||
        motorcycle.category.toLowerCase().includes(searchTerm) ||
        motorcycle.description.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });
}
