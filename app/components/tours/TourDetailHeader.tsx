import { Badge } from "@/app/components/ui/badge";

interface TourDetailHeaderProps {
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  difficulty: string;
}

export default function TourDetailHeader({
  title,
  location,
  rating,
  reviewCount,
  difficulty,
}: TourDetailHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <span>{location}</span>
        <div className="flex items-center">
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-yellow-500 mr-1"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
            {rating.toFixed(1)}
          </span>
          <span className="mx-1">•</span>
          <span>{reviewCount} reviews</span>
        </div>
        <Badge variant="outline" className="capitalize">
          {difficulty.toLowerCase()}
        </Badge>
      </div>
    </div>
  );
}
