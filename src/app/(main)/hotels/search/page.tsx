
"use client";

import { useSearchParams } from 'next/navigation';
import type { Hotel } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HotelIcon, SearchIcon, Loader2, MapIcon, StarIcon } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import Link from 'next/link';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { getHotels } from '@/lib/hotel-data';
import { HotelSearchForm } from '@/components/forms/hotel-search-form';
import { Separator } from '@/components/ui/separator';

<<<<<<< HEAD
function HotelSearchForm() {
const searchParams = useSearchParams();
=======
const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";
=======
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HotelListItem } from '@/components/cards/HotelListItem';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useCallback } from 'react';
import { getHotels } from '@/lib/hotel-data';
<<<<<<< HEAD
>>>>>>> 2e2f781 (After clicking on search button of hotel search bar this type of hotel m)
=======
import { HotelSearchForm } from '@/components/forms/hotel-search-form';
>>>>>>> 882a1b1 (Hotel Results in All Locations Showing 4 approved hotels matching your c)

export default function HotelSearchResultsPage() {
  const searchParams = useSearchParams();
>>>>>>> 04e13cb (over the place of this color use this color bg-gradient-to-br from-[#031)
  const locationQuery = searchParams.get('location');
  
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);

  const fetchAndFilterHotels = useCallback(() => {
    setIsLoadingHotels(true);
    const hotelsFromDb = getHotels();
    const approvedHotels = hotelsFromDb.filter(hotel => hotel.isApproved);
    setAllHotels(approvedHotels);

    const filtered = approvedHotels.filter(hotel => {
      if (!locationQuery) return true; 
      return hotel.location.toLowerCase().includes(locationQuery.toLowerCase());
    });
    setFilteredHotels(filtered);
    setIsLoadingHotels(false);
  }, [locationQuery]);

  useEffect(() => {
    fetchAndFilterHotels();
  }, [fetchAndFilterHotels]);

  const displayLocation = locationQuery || "All Locations";

  const sortOptions = ["Popular", "User Rating (Highest First)", "Price (Highest First)", "Price (Lowest First)"];

  if (isLoadingHotels) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Loader2 className="mr-3 h-8 w-8 animate-spin text-primary" />
          <h1 className="font-headline text-3xl font-bold">Searching Hotels...</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-3 space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <HotelSearchForm />
        </div>

        {/* Top Banner */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 mb-6">
            Here are the best options for hotels in {displayLocation}. The {filteredHotels.length} options listed below start from just Rs.142 and suit the wide range of requirements you may have. Take your pick from the best hotels in {displayLocation} from the list below and get set for an unforgettable stay! Scroll down for more options of hotels in {displayLocation}. <Button variant="link" className="p-0 h-auto">View More</Button>
        </div>

        {/* Breadcrumbs */}
        <div className="text-sm text-muted-foreground mb-4">
            Home › Hotels in India › Hotels in {displayLocation}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar for Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-4">
                <Button className="w-full">
                  <MapIcon className="mr-2 h-4 w-4" />
                  Explore on Map
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <h3 className="font-semibold">Applied Filters</h3>
                <Button variant="link" className="p-0 h-auto text-primary">Clear</Button>
              </CardHeader>
              <CardContent>
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search for locality / hotel name" className="pl-10" />
                </div>
                {locationQuery && <Badge className="mt-2">{locationQuery}</Badge>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold">Suggested For You</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  {label: "Last Minute Deals", count: 0},
                  {label: "5 Star", count: 167},
                  {label: "North Goa", count: 0, checked: true},
                  {label: "Resorts", count: 335},
                  {label: "Unmarried Couples Allowed", count: 2489},
                  {label: "Free Cancellation", count: 1160}
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id={item.label.toLowerCase().replace(/ /g, '-')} defaultChecked={item.checked}/>
                      <Label htmlFor={item.label.toLowerCase().replace(/ /g, '-')} className="font-normal">{item.label}</Label>
                    </div>
                    {item.count > 0 && <span className="text-muted-foreground">({item.count})</span>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* Right Content Area for Results */}
          <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
              <h1 className="text-2xl font-bold text-foreground">Hotels in {displayLocation}</h1>
              <Button variant="outline">Explore Travel Tips →</Button>
            </div>

            <Card className="mb-6">
              <CardContent className="p-2 flex flex-wrap items-center gap-4 text-sm">
                <span className="font-semibold">Sort By</span>
                <Separator orientation="vertical" className="h-6" />
                {sortOptions.map((opt, index) => (
                  <Button key={opt} variant={index === 0 ? "secondary" : "ghost"} size="sm">
                    {opt}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {filteredHotels.length === 0 ? (
                <Alert className="bg-card">
                <SearchIcon className="h-4 w-4" />
                <AlertTitle>No Approved Hotels Found</AlertTitle>
                <AlertDescription>
                    We couldn't find any approved hotels in {displayLocation} with the current criteria. 
                </AlertDescription>
                </Alert>
            ) : (
                <div className="space-y-6">
                    {filteredHotels.map((hotel) => (
                        <HotelListItem key={hotel.id} hotel={hotel} />
                    ))}
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function HotelSearchResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelSearchForm />
    </Suspense>
  );
}
