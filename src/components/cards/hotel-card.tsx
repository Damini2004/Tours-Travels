
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Hotel } from '@/lib/types';
import { Button } from '@/components/ui/button';
// Card related imports are removed as we're using divs for the new structure
import { MapPinIcon, StarIcon, HeartIcon, HotelIcon as HotelBuildingIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HotelCardProps {
  hotel: Hotel;
  isSaved: boolean;
  onToggleSave: (hotelId: string) => void;
}

const getRatingLabel = (rating: number): string => {
  if (rating >= 4.5) return "Exceptional";
  if (rating >= 4.0) return "Excellent";
  if (rating >= 3.5) return "Very Good";
  if (rating >= 3.0) return "Good";
  if (rating > 0) return "Okay";
  return "Not Rated";
};

const defaultHotelImage = 'https://media.istockphoto.com/id/1197480605/photo/3d-render-of-luxury-hotel-lobby-and-reception.jpg?s=612x612&w=0&k=20&c=h2DMumrFFZDGqPypcK4Whx8mM1EdCKWh8PLY2saLIzo=';
const defaultHotelHint = 'hotel lobby';

export function HotelCard({ hotel, isSaved, onToggleSave }: HotelCardProps) {
  const ratingLabel = getRatingLabel(hotel.rating);

  return (
    <div className="bg-white border border-gray-200 w-[300px] sm:w-[320px] flex-shrink-0 flex flex-col justify-between h-full shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1">
      <div className="image-wrapper relative">
        <div className="relative w-full h-48">
          <Image
            src={hotel.thumbnailUrl || defaultHotelImage}
            alt={hotel.name}
            layout="fill"
            objectFit="cover"
            className="filter brightness-95 group-hover:brightness-100 transition-filter duration-300 ease-in-out"
            data-ai-hint={hotel.thumbnailHint || defaultHotelHint}
          />
        </div>
        <button
          onClick={() => onToggleSave(hotel.id)}
          aria-label={isSaved ? "Unsave hotel" : "Save hotel"}
          className="save absolute top-2.5 right-2.5 text-muted-foreground bg-transparent border-none rounded-full p-1.5 text-xl cursor-pointer transition-colors duration-300 hover:text-destructive z-10"
        >
          <HeartIcon className={cn("h-5 w-5", isSaved && "fill-accent text-accent")} />
        </button>
      </div>
      <div className="offer-info p-3.5 md:p-4 flex-grow flex flex-col">
        <div className="flex items-center text-xs text-muted-foreground mb-1">
            <MapPinIcon className="mr-1 h-3 w-3 flex-shrink-0" /> 
            <span className="truncate">{hotel.location}</span>
        </div>
        
        <h3 className="font-bold my-1 text-base leading-snug text-gray-900 h-[3.2em] overflow-hidden">
          {hotel.name}
        </h3>

        {hotel.rating > 0 && (
          <div className="rating flex items-center gap-1.5 bg-secondary/70 px-2 py-0.5 rounded-full w-fit my-2 font-semibold text-secondary-foreground">
            <span className="score bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white font-bold px-2 py-0.5 rounded-md text-xs">
              {hotel.rating.toFixed(1)}
            </span>
            <span className="text-xs">{ratingLabel}</span>
          </div>
        )}
        
        <div className="price-info mt-auto pt-2">
          <p className="my-1 text-xs text-gray-600">
            From <strong className="text-base text-gray-800">${hotel.pricePerNight.toFixed(2)}</strong> / night
          </p>
          <Button asChild className="mt-2 w-full bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white px-3 py-1.5 cursor-pointer rounded-md font-semibold text-sm transition-opacity duration-300 ease-in-out hover:opacity-90">
            <Link href={`/hotels/${hotel.id}`}>
              View Details <HotelBuildingIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
