"use client";

import { useSearchParams } from 'next/navigation';
import { FlightCard } from '@/components/cards/flight-card';
import { placeholderFlights } from '@/lib/placeholder-data';
import type { Flight } from '@/lib/types';
import { useSavedItems } from '@/hooks/use-saved-items';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlaneIcon, SearchIcon } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FlightSearchResultsPage() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('to');
  const departureDate = searchParams.get('departureDate');
  const passengers = searchParams.get('passengers');

  const { addFlightToSaved, removeFlightFromSaved, isFlightSaved, isLoading } = useSavedItems();

  // Filter flights based on query params
  const flights: Flight[] = placeholderFlights.filter(flight => {
    let matches = true;
    if (destination && !flight.to.toLowerCase().includes(destination.toLowerCase())) {
      matches = false;
    }
    // Basic date matching (can be improved to compare actual dates)
    if (departureDate && !flight.departureTime.startsWith(departureDate)) {
      // matches = false; // Commenting out for broader results with placeholder data
    }
    // Passenger count isn't part of flight data, so not filtering by it
    return matches;
  });

  const displayDestination = destination || "All Destinations";

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
            <PlaneIcon className="mr-3 h-8 w-8 text-primary" /> Flight Results for {displayDestination}
          </h1>
          <p className="text-muted-foreground">Loading available flights...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-lg bg-card" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold flex items-center">
         <PlaneIcon className="mr-3 h-8 w-8 text-primary" /> Flight Results for {displayDestination}
        </h1>
        {departureDate && <p className="text-muted-foreground">Departure Date: {departureDate}</p>}
        {passengers && <p className="text-muted-foreground">Passengers: {passengers}</p>}
        <p className="text-muted-foreground mt-1">Showing {flights.length} flights matching your criteria.</p>
      </div>

      {flights.length === 0 ? (
        <Alert className="bg-card">
          <SearchIcon className="h-4 w-4" />
          <AlertTitle>No Flights Found</AlertTitle>
          <AlertDescription>
            We couldn&apos;t find any flights for {displayDestination} with the current criteria. 
            <Button variant="link" asChild className="p-1 text-primary">
              <Link href="/">Try adjusting your search</Link>
            </Button>
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
