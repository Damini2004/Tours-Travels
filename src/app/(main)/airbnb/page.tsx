
"use client";

import { PropertyCard } from '@/components/cards/PropertyCard';
import { placeholderProperties } from '@/lib/placeholder-data';
import type { Property } from '@/lib/types';
import { HomeIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

export default function AirbnbPage() {
  // In a real app, you'd fetch properties, potentially based on filters
  const properties: Property[] = placeholderProperties;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <HomeIcon className={`mx-auto h-16 w-16 mb-4 ${gradientTextClass}`} />
        <h1 className="text-4xl font-headline font-bold mb-2 text-foreground">Find your next getaway</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore unique homes, cabins, apartments, and more for your perfect stay.
        </p>
      </header>

      {/* Placeholder Search Bar */}
      <div className="mb-10 max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Input 
            type="search"
            placeholder="Search destinations, e.g., 'Paris', 'Beach house in Bali'"
            className="h-12 text-base pl-10 pr-20 rounded-full shadow-md focus:ring-2 focus:ring-primary"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Search
          </Button>
        </div>
      </div>


      {properties.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No properties available right now. Please check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
