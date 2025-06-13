
"use client";

import { useSearchParams } from 'next/navigation';
import { FlightCard } from '@/components/cards/flight-card';
import { placeholderFlights } from '@/lib/placeholder-data';
import type { Flight } from '@/lib/types';
import { useSavedItems } from '@/hooks/use-saved-items';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlaneIcon, SearchIcon, UserIcon, UsersIcon as UsersGroupIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FlightSearchResultsPage() {
  const searchParams = useSearchParams();
  
  // New parameters from FlightBooking form
  const originLocationCode = searchParams.get('originLocationCode');
  const destinationLocationCode = searchParams.get('destinationLocationCode');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');
  const infants = searchParams.get('infants');
  const travelClass = searchParams.get('travelClass');
  const nonStop = searchParams.get('nonStop') === 'true'; // Convert string to boolean

  const { addFlightToSaved, removeFlightFromSaved, isFlightSaved, isLoading } = useSavedItems();

  // Filter flights based on query params (current logic uses destinationLocationCode)
  const flights: Flight[] = placeholderFlights.filter(flight => {
    let matches = true;
    if (destinationLocationCode && !flight.to.toLowerCase().includes(destinationLocationCode.toLowerCase()) && !flight.to.toLowerCase().includes(placeholderCities.find(c=>c.code === destinationLocationCode)?.city.toLowerCase() || '')) {
      // Allow matching by code or city name if available (simple check)
      const destCityMatch = placeholderCities.find(c => c.code.toUpperCase() === destinationLocationCode.toUpperCase());
      if (destCityMatch && !flight.to.toLowerCase().includes(destCityMatch.city.toLowerCase())){
         matches = false;
      } else if (!destCityMatch) {
         matches = false;
      }
    }
    // Basic date matching (can be improved to compare actual dates)
    // if (departureDate && !flight.departureTime.startsWith(departureDate)) {
    //   // matches = false; // Commenting out for broader results with placeholder data
    // }
    return matches;
  });

  const displayDestination = destinationLocationCode || "All Destinations";
  const displayOrigin = originLocationCode || "Any Origin";

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
            <PlaneIcon className="mr-3 h-8 w-8 text-primary" /> Flight Results
          </h1>
          <p className="text-muted-foreground">Loading available flights from {displayOrigin} to {displayDestination}...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-lg bg-card" />)}
        </div>
      </div>
    );
  }

  // Helper function to find city name from code for display
  const getCityName = (code: string | null) => {
    if (!code) return "N/A";
    const city = placeholderFlights.find(f => f.from.includes(code) || f.to.includes(code)); //簡易的な検索
    if (city) {
        if (city.from.includes(code)) return city.from;
        if (city.to.includes(code)) return city.to;
    }
    const popularCity = placeholderCities.find(pc => pc.code === code);
    if(popularCity) return popularCity.city;
    return code;
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold flex items-center">
         <PlaneIcon className="mr-3 h-8 w-8 text-primary" /> Flight Results
        </h1>
        <p className="text-muted-foreground text-lg">
            Searching flights from <strong>{getCityName(originLocationCode)}</strong> to <strong>{getCityName(destinationLocationCode)}</strong>
        </p>
        {departureDate && <p className="text-muted-foreground">Departure: {departureDate}</p>}
        {returnDate && <p className="text-muted-foreground">Return: {returnDate}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground mt-1">
            {(adults || children || infants) && (
                <span className="flex items-center"><UsersGroupIcon className="mr-1 h-4 w-4" /> 
                    {adults && `${adults} Adult(s) `}
                    {children && `${children} Child(ren) `}
                    {infants && `${infants} Infant(s)`}
                </span>
            )}
            {travelClass && <span>Class: {travelClass}</span>}
            {nonStop ? 
                <span className="flex items-center"><CheckCircleIcon className="mr-1 h-4 w-4 text-green-500" /> Non-stop preferred</span> :
                <span className="flex items-center"><XCircleIcon className="mr-1 h-4 w-4 text-red-500" /> Stops allowed</span>
            }
        </div>
        <p className="text-muted-foreground mt-2">Showing {flights.length} flights matching your criteria.</p>
      </div>

      {flights.length === 0 ? (
        <Alert className="bg-card">
          <SearchIcon className="h-4 w-4" />
          <AlertTitle>No Flights Found</AlertTitle>
          <AlertDescription>
            We couldn&apos;t find any flights for the selected criteria. 
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

// Minimal placeholder city data for getCityName fallback
const placeholderCities = [
  { city: "New York", code: "JFK" },
  { city: "London", code: "LHR" },
  { city: "Paris", code: "CDG" },
  { city: "Tokyo", code: "NRT" },
  { city: "Los Angeles", code: "LAX" },
  { city: "Sydney", code: "SYD" },
  { city: "Mumbai", code: "BOM" },
  { city: "New Delhi", code: "DEL" },
  { city: "Bangkok", code: "BKK" },
  { city: "Bengaluru", code: "BLR" },
  { city: "Pune", code: "PNQ" },
  { city: "Chennai", code: "MAA" },
  { city: "Kolkata", code: "CCU" },
  { city: "Hyderabad", code: "HYD" },
];

    