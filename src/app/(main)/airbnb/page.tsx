
"use client";

import Link from 'next/link';
import { PropertyCard } from '@/components/cards/PropertyCard';
import type { Property } from '@/lib/types';
import { HomeIcon, SearchIcon, PlusCircleIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { getProperties } from '@/lib/airbnb-data'; // Import the new data fetching function

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

export default function AirbnbPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch properties from localStorage via airbnb-data.ts
    const loadedProperties = getProperties();
    setProperties(loadedProperties);
    setIsLoading(false);
  }, []);

  // In a real app, you'd fetch properties, potentially based on filters
  // For now, using placeholderProperties from airbnb-data
  
  if (isLoading) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
            <HomeIcon className={`mx-auto h-16 w-16 mb-4 animate-pulse ${gradientTextClass}`} />
            <p className="text-lg text-muted-foreground">Loading properties...</p>
        </div>
      )
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <HomeIcon className={`mx-auto h-16 w-16 mb-4 ${gradientTextClass}`} />
        <h1 className="text-4xl font-headline font-bold mb-2 text-foreground">Find your next getaway</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore unique homes, cabins, apartments, and more for your perfect stay.
        </p>
      </header>

      <div className="mb-10 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex items-center flex-grow w-full">
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
        <Button asChild variant="outline" className="h-12 rounded-full shadow-md hover:bg-primary/10 w-full sm:w-auto">
          <Link href="/airbnb/host/new-listing" className="flex items-center">
            <PlusCircleIcon className="mr-2 h-5 w-5" />
            List your space
          </Link>
        </Button>
      </div>


      {properties.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No properties available right now. Be the first to list a space!</p>
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
