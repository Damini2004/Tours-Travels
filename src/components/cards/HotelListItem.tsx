
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Hotel } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarIcon, MapPinIcon } from 'lucide-react';

interface HotelListItemProps {
  hotel: Hotel;
}

const getRatingDescription = (rating: number) => {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  return 'Okay';
};

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

export function HotelListItem({ hotel }: HotelListItemProps) {
  const originalPrice = hotel.pricePerNight * 1.25;
  const reviewCount = Math.floor(Math.random() * 500) + 10; // Fake review count
  const ratingDescription = getRatingDescription(hotel.rating);

  return (
    <Card className="w-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-card">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Image Section */}
          <div className="md:col-span-4">
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={hotel.thumbnailUrl || 'https://placehold.co/400x300.png'}
                alt={hotel.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint={hotel.thumbnailHint || 'hotel exterior'}
              />
            </div>
            <div className="grid grid-cols-4 gap-1 mt-2">
              {(hotel.images || []).slice(0, 4).map((img, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                  <Image
                    src={img}
                    alt={`${hotel.name} thumbnail ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className={index === 3 && (hotel.images?.length || 0) > 4 ? 'filter brightness-50' : ''}
                    data-ai-hint={hotel.imageHints?.[index] || 'hotel room'}
                  />
                  {index === 3 && (hotel.images?.length || 0) > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                      +{ (hotel.images?.length || 0) - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="md:col-span-5 flex flex-col">
            <div className="flex items-center">
              <h3 className="font-bold text-lg text-foreground mr-2">{hotel.name}</h3>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(hotel.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <MapPinIcon className="h-4 w-4 mr-1" /> {hotel.location}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline">Couple Friendly</Badge>
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">Free Cancellation</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {hotel.description || 'No description available.'}
            </p>
            <div className="mt-auto pt-4">
               <Button asChild variant="default" className="bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white">
                <Link href={`/hotels/${hotel.id}`}>View More</Link>
               </Button>
            </div>
          </div>

          {/* Price and Rating Section */}
          <div className="md:col-span-3 text-right flex flex-col items-end justify-between">
            <div>
              <div className="flex items-center justify-end gap-2">
                <span className={`font-semibold ${gradientTextClass}`}>{ratingDescription}</span>
                <span className="bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white text-sm font-bold px-2 py-0.5 rounded-md">{hotel.rating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-muted-foreground">({reviewCount} Ratings)</p>
            </div>
            
            <div className="flex flex-col items-end">
              <Badge variant="default" className="mb-2 bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white border-transparent">Last Minute Deal</Badge>
              <s className="text-muted-foreground">${originalPrice.toFixed(2)}</s>
              <p className={`text-2xl font-bold ${gradientTextClass}`}>${hotel.pricePerNight.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">+ ${ (hotel.pricePerNight * 0.1).toFixed(2) } taxes & fees</p>
              <p className="text-xs text-muted-foreground">Per Night</p>
            </div>

            <Button asChild className="w-full bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white mt-4 font-bold">
              <Link href={`/hotels/${hotel.id}`}>Login to Book Now</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
