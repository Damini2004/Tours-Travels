"use client";

import { useSearchParams } from 'next/navigation';
import { HotelCard } from '@/components/cards/hotel-card';
import { placeholderHotels } from '@/lib/placeholder-data';
import type { Hotel } from '@/lib/types';
import { useSavedItems } from '@/hooks/use-saved-items';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HotelIcon, SearchIcon } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

export default function HotelSearchResultsPage() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location') || 'your chosen location';
  const { savedHotels, addHotelToSaved, removeHotelFromSaved, isHotelSaved, isLoading } = useSavedItems();

  // In a real app, you would fetch hotels based on searchParams
  const hotels: Hotel[] = placeholderHotels.filter(hotel => 
    location === 'your chosen location' || hotel.location.toLowerCase().includes(location.toLowerCase())
  );

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
            <HotelIcon className="mr-3 h-8 w-8 text-primary" /> Hotel Results for {location}
          </h1>
          <p className="text-muted-foreground">Loading available hotels...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[400px] w-full rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold flex items-center">
          <HotelIcon className="mr-3 h-8 w-8 text-primary" /> Hotel Results in {location}
        </h1>
        <p className="text-muted-foreground">Showing {hotels.length} hotels matching your criteria.</p>
      </div>

      {hotels.length === 0 ? (
         <Alert>
          <SearchIcon className="h-4 w-4" />
          <AlertTitle>No Hotels Found</AlertTitle>
          <AlertDescription>
            We couldn't find any hotels in {location} with the current criteria. Try adjusting your search.
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
