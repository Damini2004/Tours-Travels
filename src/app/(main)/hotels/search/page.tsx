"use client";

import { useSearchParams } from 'next/navigation';
import { HotelCard } from '@/components/cards/hotel-card';
import { placeholderHotels } from '@/lib/placeholder-data';
import type { Hotel } from '@/lib/types';
import { useSavedItems } from '@/hooks/use-saved-items';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HotelIcon, SearchIcon } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HotelSearchResultsPage() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location');
  const checkInDate = searchParams.get('checkInDate');
  const guests = searchParams.get('guests');
  
  const { addHotelToSaved, removeHotelFromSaved, isHotelSaved, isLoading } = useSavedItems();

  const hotels: Hotel[] = placeholderHotels.filter(hotel => {
    if (!location) return true; // Show all if no location specified
    return hotel.location.toLowerCase().includes(location.toLowerCase());
  });

  const displayLocation = location || "All Locations";

  const handleToggleSave = (hotelId: string) => {
    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel) return;
    if (isHotelSaved(hotelId)) {
      removeHotelFromSaved(hotelId);
    } else {
      addHotelToSaved(hotel);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-bold flex items-center">
            <HotelIcon className="mr-3 h-8 w-8 text-primary" /> Hotel Results in {displayLocation}
          </h1>
          <p className="text-muted-foreground">Loading available hotels...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[400px] w-full rounded-lg bg-card" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold flex items-center">
          <HotelIcon className="mr-3 h-8 w-8 text-primary" /> Hotel Results in {displayLocation}
        </h1>
        {checkInDate && <p className="text-muted-foreground">Check-in: {checkInDate}</p>}
        {guests && <p className="text-muted-foreground">Guests: {guests}</p>}
        <p className="text-muted-foreground mt-1">Showing {hotels.length} hotels matching your criteria.</p>
      </div>

      {hotels.length === 0 ? (
         <Alert className="bg-card">
          <SearchIcon className="h-4 w-4" />
          <AlertTitle>No Hotels Found</AlertTitle>
          <AlertDescription>
            We couldn&apos;t find any hotels in {displayLocation} with the current criteria. 
            <Button variant="link" asChild className="p-1 text-primary">
              <Link href="/">Try adjusting your search</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard 
              key={hotel.id} 
              hotel={hotel}
              isSaved={isHotelSaved(hotel.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
