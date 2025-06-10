"use client";

import { useSearchParams } from 'next/navigation';
import { FlightCard } from '@/components/cards/flight-card';
import { placeholderFlights } from '@/lib/placeholder-data';
import type { Flight } from '@/lib/types';
import { useSavedItems } from '@/hooks/use-saved-items';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlaneIcon, SearchIcon } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

export default function FlightSearchResultsPage() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('to') || 'your destination';
  const { savedFlights, addFlightToSaved, removeFlightFromSaved, isFlightSaved, isLoading } = useSavedItems();

  // In a real app, you would fetch flights based on searchParams
  const flights: Flight[] = placeholderFlights.filter(flight => 
    destination === 'your destination' || flight.to.toLowerCase().includes(destination.toLowerCase())
  );

  const handleToggleSave = (flightId: string) => {
    const flight = flights.find(f => f.id === flightId);
    if (!flight) return;
    if (isFlightSaved(flightId)) {
      removeFlightFromSaved(flightId);
    } else {
      addFlightToSaved(flight);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-bold flex items-center">
            <PlaneIcon className="mr-3 h-8 w-8 text-primary" /> Flight Results for {destination}
          </h1>
          <p className="text-muted-foreground">Loading available flights...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold flex items-center">
         <PlaneIcon className="mr-3 h-8 w-8 text-primary" /> Flight Results for {destination}
        </h1>
        <p className="text-muted-foreground">Showing {flights.length} flights matching your criteria.</p>
      </div>

      {flights.length === 0 ? (
        <Alert>
          <SearchIcon className="h-4 w-4" />
          <AlertTitle>No Flights Found</AlertTitle>
          <AlertDescription>
            We couldn't find any flights for {destination} with the current criteria. Try adjusting your search.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <FlightCard 
              key={flight.id} 
              flight={flight}
              isSaved={isFlightSaved(flight.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
