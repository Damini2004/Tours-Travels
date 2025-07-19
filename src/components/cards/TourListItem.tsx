
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { TourPackage } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Plane, Bed, Utensils, Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TourListItemProps {
  tour: TourPackage;
  currencySymbol: string;
}

export function TourListItem({ tour, currencySymbol }: TourListItemProps) {
  const [isSaved, setIsSaved] = useState(false);

  const calculateDiscount = (price: number, originalPrice: number) => {
    if (originalPrice <= price || originalPrice <= 0) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };
  
  const discount = calculateDiscount(tour.price, tour.originalPrice);

  return (
    <Card className="w-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-white border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3 relative group">
           <Image
            src={tour.imageUrl || 'https://placehold.co/400x300.png'}
            alt={tour.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            data-ai-hint={tour.imageHint || 'tour destination'}
          />
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-800 rounded-md h-8 px-2.5"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSaved(prev => !prev); }}
          >
            <Heart className={cn("h-4 w-4 mr-1.5", isSaved && "text-red-500 fill-red-500")} />
            Save
          </Button>
           <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">1/25</div>
        </div>

        {/* Details Section */}
        <div className="md:w-2/3 flex flex-col p-4">
          <div className="flex flex-col md:flex-row justify-between flex-grow">
            {/* Left side of details */}
            <div className="flex-grow pr-4 flex flex-col">
               <p className="text-xs text-gray-500 mb-1">Starts in {tour.location.split(',')[0]}, ends in {tour.location.split(',').pop()}</p>
              <h3 className="font-bold text-lg text-[#155e63] hover:text-[#155e63]/80">
                <Link href={`/tours/${tour.id}`}>{tour.title}</Link>
              </h3>
              <p className="text-sm text-gray-600 mt-1">{tour.tourType}</p>
              <p className="text-sm text-gray-600">{tour.durationDays} days</p>
              
              <div className="mt-auto pt-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-md"><Plane className="w-4 h-4 text-gray-500 shrink-0"/><span>Flights</span></div>
                    <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-md"><Bed className="w-4 h-4 text-gray-500 shrink-0"/><span>Hotels</span></div>
                    <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-md"><Utensils className="w-4 h-4 text-gray-500 shrink-0"/><span>Meals</span></div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
                    <span className="font-semibold text-gray-700">4.5/5</span>
                    <span className="text-gray-500">(120 Reviews)</span>
                </div>
              </div>
            </div>

            {/* Right side of details (Price) */}
            <div className="text-left md:text-right mt-4 md:mt-0 flex-shrink-0 md:w-48 flex flex-col justify-between">
              <div>
                <p className="text-xs text-gray-500">{tour.durationDays} days from</p>
                <p className="text-2xl font-bold text-[#155e63]">
                  {currencySymbol}{tour.price.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-gray-600"> /person</span>
                </p>
                <p className="text-xs text-gray-500">Valued up to <s>{currencySymbol}{tour.originalPrice.toLocaleString('en-IN')}</s></p>
                {discount > 0 && <Badge variant="destructive" className="bg-green-600 text-white mt-1">SAVE {discount}%</Badge>}
                <p className="text-xs text-gray-500 mt-1">Includes taxes & fees</p>
              </div>
              <Button asChild className="w-full mt-4 bg-[#155e63] text-white hover:bg-gray-700">
                <Link href={`/tours/${tour.id}`}>View offer</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
