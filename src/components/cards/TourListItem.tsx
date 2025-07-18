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
            className="w-full h-full object-cover"
            data-ai-hint={tour.imageHint || 'tour destination'}
          />
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-800 rounded-md"
            onClick={() => setIsSaved(prev => !prev)}
          >
            <Heart className={cn("h-4 w-4 mr-1.5", isSaved && "text-red-500 fill-red-500")} />
            Save
          </Button>
           <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">1/25</div>
        </div>

        {/* Details Section */}
        <div className="md:w-2/3 flex flex-col p-4">
          <div className="flex flex-col md:flex-row justify-between">
            {/* Left side of details */}
            <div className="flex-grow pr-4">
               <p className="text-xs text-gray-500 mb-1">Starts in {tour.location.split(',')[0]}, ends in {tour.location.split(',').pop()}</p>
              <h3 className="font-bold text-lg text-gray-800 hover:text-gray-600">
                <Link href="#">{tour.title}</Link>
              </h3>
              <p className="text-sm text-gray-600 mt-1">{tour.tourType}</p>
              <p className="text-sm text-gray-600">{tour.durationDays} days · ...</p>
              <Button variant="link" className="p-0 h-auto text-sm text-blue-600 hover:underline">View itinerary</Button>

              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                    <Plane className="w-4 h-4 mt-0.5 text-gray-500 shrink-0"/>
                    <p>Exclusive use of a private Luxury Escapes chartered A320-200 aircraft between destinations rarely seen...</p>
                </div>
                <div className="flex items-start gap-2">
                    <Bed className="w-4 h-4 mt-0.5 text-gray-500 shrink-0"/>
                    <p>Stays at exceptional hotels handpicked for you, from Sofitel...</p>
                </div>
                 <div className="flex items-start gap-2">
                    <Utensils className="w-4 h-4 mt-0.5 text-gray-500 shrink-0"/>
                    <p>Flexibility to design your day in each destination, with A$500 credit...</p>
                </div>
                <Button variant="link" className="p-0 h-auto text-sm text-blue-600 font-semibold hover:underline">+18 more</Button>
              </div>
            </div>

            {/* Right side of details (Price) */}
            <div className="text-left md:text-right mt-4 md:mt-0 flex-shrink-0 md:w-48">
              <p className="text-xs text-gray-500">{tour.durationDays} days from</p>
              <p className="text-2xl font-bold text-gray-800">
                {currencySymbol}{tour.price.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-gray-600"> /person</span>
              </p>
              <p className="text-xs text-gray-500">Valued up to {currencySymbol}{tour.originalPrice.toLocaleString('en-IN')}</p>
              {discount > 0 && <Badge variant="destructive" className="bg-green-600 text-white mt-1">-{discount}%</Badge>}
              <p className="text-xs text-gray-500 mt-1">Twin room</p>
              <p className="text-xs text-gray-500">Includes taxes & fees</p>
              <Button className="w-full mt-4 bg-gray-800 text-white hover:bg-gray-700">
                View offer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
