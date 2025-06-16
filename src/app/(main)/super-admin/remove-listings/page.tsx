
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2Icon, HotelIcon as HotelBuildingIcon, PlaneIcon, SearchIcon } from "lucide-react";

// Placeholder data
const placeholderListedHotels = [
  { id: "ht001", name: "The Grand Plaza", location: "London, UK", listedDate: "2023-05-10" },
  { id: "ht002", name: "Sakura Inn Tokyo", location: "Tokyo, Japan", listedDate: "2023-06-15" },
];
const placeholderListedFlights = [
  { id: "FL001", airline: "SkyHigh Airlines", route: "JFK to LHR", listedDate: "2023-04-01" },
  { id: "FL002", airline: "Horizon Wings", route: "CDG to NRT", listedDate: "2023-04-20" },
];


export default function RemoveListingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center text-foreground">
          <Trash2Icon className="mr-3 h-8 w-8 text-primary" /> Remove Listings
        </h1>
        <p className="text-muted-foreground">Manage and remove hotel or flight listings from the platform.</p>
      </div>

      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
          <TabsTrigger value="hotels" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"><HotelBuildingIcon className="mr-2 h-4 w-4" />Hotels ({placeholderListedHotels.length})</TabsTrigger>
          <TabsTrigger value="flights" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"><PlaneIcon className="mr-2 h-4 w-4" />Flights ({placeholderListedFlights.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="hotels">
          {placeholderListedHotels.length === 0 ? (
             <Alert className="bg-card text-card-foreground">
              <SearchIcon className="h-4 w-4" />
              <AlertTitle>No Hotels Listed</AlertTitle>
              <AlertDescription>There are no hotels currently listed on the platform.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {placeholderListedHotels.map((hotel) => (
                <Card key={hotel.id} className="bg-card text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg">{hotel.name}</CardTitle>
                    <CardDescription>{hotel.location} - Listed on: {hotel.listedDate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" size="sm">
                      <Trash2Icon className="mr-2 h-4 w-4" /> Remove Hotel
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="flights">
           {placeholderListedFlights.length === 0 ? (
            <Alert className="bg-card text-card-foreground">
              <SearchIcon className="h-4 w-4" />
              <AlertTitle>No Flights Listed</AlertTitle>
              <AlertDescription>There are no flights currently listed on the platform.</AlertDescription>
            </Alert>
          ) : (
             <div className="space-y-4">
              {placeholderListedFlights.map((flight) => (
                <Card key={flight.id} className="bg-card text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg">{flight.airline} - {flight.route}</CardTitle>
                    <CardDescription>Listed on: {flight.listedDate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Button variant="destructive" size="sm">
                      <Trash2Icon className="mr-2 h-4 w-4" /> Remove Flight
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
