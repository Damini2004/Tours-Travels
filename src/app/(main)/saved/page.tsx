"use client";

import { useSavedItems } from '@/hooks/use-saved-items';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlightCard } from '@/components/cards/flight-card';
import { HotelCard } from '@/components/cards/hotel-card';
import { PlaneIcon, HotelIcon, StarIcon, SearchIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function SavedItemsPage() {
  const { 
    savedFlights, 
    savedHotels, 
    addFlightToSaved, 
    removeFlightFromSaved, 
    isFlightSaved,
    addHotelToSaved,
    removeHotelFromSaved,
    isHotelSaved,
    isLoading 
  } = useSavedItems();

  const handleToggleFlightSave = (flightId: string) => {
    const flight = savedFlights.find(f => f.id === flightId); // Should always find if it's saved
    if (!flight && !isFlightSaved(flightId)) { // If not found and not saved (safety for adding)
       // This case should ideally not happen if flight data comes from a central source
       // For now, if we only have ID, we remove. If we had full flight object, we could add.
       // Placeholder flights are available globally so this might be ok.
       const placeholderFlight = placeholderFlights.find(f => f.id === flightId);
       if(placeholderFlight) addFlightToSaved(placeholderFlight);

    } else if (flight && isFlightSaved(flightId)) {
        removeFlightFromSaved(flightId);
    }
  };

  const handleToggleHotelSave = (hotelId: string) => {
    const hotel = savedHotels.find(h => h.id === hotelId);
     if (!hotel && !isHotelSaved(hotelId)) {
       const placeholderHotel = placeholderHotels.find(h => h.id === hotelId);
       if(placeholderHotel) addHotelToSaved(placeholderHotel);
    } else if (hotel && isHotelSaved(hotelId)) {
        removeHotelFromSaved(hotelId);
    }
  };

  // Temporary import for placeholder data (should be part of a context or fetched)
  const { placeholderFlights, placeholderHotels } = require('@/lib/placeholder-data');


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
            <StarIcon className="mx-auto h-12 w-12 text-accent mb-2" />
            <h1 className="font-headline text-3xl md:text-4xl font-bold">Your Saved Trips</h1>
            <p className="text-muted-foreground">Loading your favorite flights and hotels...</p>
        </div>
        <Tabs defaultValue="flights" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="flights"><PlaneIcon className="mr-2 h-4 w-4" />Flights ({savedFlights.length})</TabsTrigger>
                <TabsTrigger value="hotels"><HotelIcon className="mr-2 h-4 w-4" />Hotels ({savedHotels.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="flights">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-lg" />)}
                </div>
            </TabsContent>
            <TabsContent value="hotels">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2].map(i => <Skeleton key={i} className="h-[400px] w-full rounded-lg" />)}
                </div>
            </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <StarIcon className="mx-auto h-12 w-12 text-accent mb-2" />
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Your Saved Trips</h1>
        <p className="text-muted-foreground">Revisit your favorite flights and hotels.</p>
      </div>

      <Tabs defaultValue="flights" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="flights" className="py-3 text-base">
            <PlaneIcon className="mr-2 h-5 w-5" /> Flights ({savedFlights.length})
          </TabsTrigger>
          <TabsTrigger value="hotels" className="py-3 text-base">
            <HotelIcon className="mr-2 h-5 w-5" /> Hotels ({savedHotels.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights">
          {savedFlights.length === 0 ? (
            <Alert className="mt-6">
              <SearchIcon className="h-4 w-4" />
              <AlertTitle>No Saved Flights</AlertTitle>
              <AlertDescription>
                You haven't saved any flights yet. Start exploring and save your favorites!
                <Button asChild variant="link" className="px-1 text-accent">
                    <Link href="/flights/search">Find Flights</Link>
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedFlights.map((flight) => (
                <FlightCard 
                  key={flight.id} 
                  flight={flight}
                  isSaved={isFlightSaved(flight.id)}
                  onToggleSave={() => handleToggleFlightSave(flight.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="hotels">
          {savedHotels.length === 0 ? (
            <Alert className="mt-6">
              <SearchIcon className="h-4 w-4" />
              <AlertTitle>No Saved Hotels</AlertTitle>
              <AlertDescription>
                You haven't saved any hotels yet. Discover amazing places to stay!
                <Button asChild variant="link" className="px-1 text-accent">
                    <Link href="/hotels/search">Find Hotels</Link>
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedHotels.map((hotel) => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel}
                  isSaved={isHotelSaved(hotel.id)}
                  onToggleSave={() => handleToggleHotelSave(hotel.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
