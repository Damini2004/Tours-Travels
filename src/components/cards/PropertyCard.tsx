
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { HeartIcon, StarIcon, MapPinIcon, UsersIcon, BedIcon, BathIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  // onToggleSave: (propertyId: string) => void; // Future use
  // isSaved: boolean; // Future use
}

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/airbnb/${property.id}`} className="block group">
      <div className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={property.thumbnailUrl || 'https://placehold.co/600x400.png'}
            alt={property.title}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={property.thumbnailHint || "property exterior"}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/70 hover:bg-background text-foreground rounded-full"
            // onClick={(e) => { e.preventDefault(); onToggleSave(property.id); }} // Future use
            aria-label="Save property"
          >
            <HeartIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <p className="text-sm font-semibold text-foreground truncate pr-2">{property.title}</p>
            {property.rating > 0 && (
              <div className="flex items-center gap-1 text-sm text-foreground shrink-0">
                <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{property.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mb-1 truncate">{property.type}</p>
          <p className="text-xs text-muted-foreground mb-2 truncate">{property.location}</p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span><UsersIcon className="inline h-3 w-3 mr-0.5"/>{property.guests} guests</span>
            <span>·</span>
            <span><BedIcon className="inline h-3 w-3 mr-0.5"/>{property.bedrooms} bed{property.bedrooms !== 1 ? 's':''}</span>
          </div>
          
          <div className="mt-auto">
            <p className="text-base text-foreground">
              <span className={`font-bold ${gradientTextClass}`}>${property.pricePerNight}</span>
              <span className="text-sm text-muted-foreground"> / night</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
