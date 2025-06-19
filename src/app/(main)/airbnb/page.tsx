
"use client";

import Link from 'next/link';
import { PropertyCard } from '@/components/cards/PropertyCard';
import type { Property } from '@/lib/types';
import { HomeIcon, SearchIcon, PlusCircleIcon, CalendarDaysIcon, UsersIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { getProperties } from '@/lib/airbnb-data';
import { Separator } from '@/components/ui/separator';

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

export default function AirbnbPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // For location search

  useEffect(() => {
    const loadedProperties = getProperties();
    setProperties(loadedProperties);
    setIsLoading(false);
  }, []);

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="text-center md:text-left">
                <HomeIcon className={`mx-auto md:mx-0 h-12 w-12 mb-2 ${gradientTextClass}`} />
                <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">Explore Stays</h1>
                <p className="text-md text-muted-foreground max-w-xl">
                Discover unique homes, cabins, and apartments for your next adventure.
                </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0 h-11 rounded-full shadow-md hover:bg-primary/10 text-base px-6">
                <Link href="/airbnb/host/new-listing" className="flex items-center">
                    <PlusCircleIcon className="mr-2 h-5 w-5" />
                    List your space
                </Link>
            </Button>
        </div>

        {/* Enhanced Search Bar UI */}
        <div className="bg-card p-4 rounded-xl shadow-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-2">
                    <label htmlFor="location-search" className="block text-sm font-medium text-muted-foreground mb-1">Where</label>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="location-search"
                            type="search"
                            placeholder="Search destinations or property names"
                            className="h-12 text-base pl-10 shadow-sm focus:ring-2 focus:ring-primary w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="check-in" className="block text-sm font-medium text-muted-foreground mb-1">Check in</label>
                    <Button variant="outline" className="h-12 w-full justify-start text-left font-normal text-muted-foreground shadow-sm">
                        <CalendarDaysIcon className="mr-2 h-4 w-4" /> Add dates
                    </Button>
                </div>
                 <div>
                    <label htmlFor="check-out" className="block text-sm font-medium text-muted-foreground mb-1">Check out</label>
                    <Button variant="outline" className="h-12 w-full justify-start text-left font-normal text-muted-foreground shadow-sm">
                        <CalendarDaysIcon className="mr-2 h-4 w-4" /> Add dates
                    </Button>
                </div>
                <div className="md:col-span-3">
                    <label htmlFor="guests" className="block text-sm font-medium text-muted-foreground mb-1">Who</label>
                     <Button variant="outline" className="h-12 w-full justify-start text-left font-normal text-muted-foreground shadow-sm">
                        <UsersIcon className="mr-2 h-4 w-4" /> Add guests
                    </Button>
                </div>
                <Button
                    type="submit"
                    className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base shadow-md md:col-span-1"
                    onClick={() => { /* Actual search/filter logic to be added */ }}
                >
                    <SearchIcon className="mr-2 h-5 w-5" />Search
                </Button>
            </div>
             {/* Placeholder for advanced filters */}
            <div className="mt-3 text-right">
                <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">More filters</Button>
            </div>
        </div>
      </header>
      
      <Separator className="my-8" />

      {filteredProperties.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No properties found matching your search. Be the first to list a space or try different keywords!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
