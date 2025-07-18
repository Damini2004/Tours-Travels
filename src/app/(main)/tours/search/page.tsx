"use client";

import { Suspense, useMemo, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { TourPackage } from "@/lib/types";
import { getTourPackages } from "@/lib/tour-data";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings, currencySymbols } from '@/context/SettingsContext';
import { TourListItem } from "@/components/cards/TourListItem";


function TourSearchResultsContent() {
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const currencySymbol = currencySymbols[settings.currency] || '₹';

  const [allTours, setAllTours] = useState<TourPackage[]>([]);
  const [filteredTours, setFilteredTours] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [durationRange, setDurationRange] = useState<[number, number]>([1, 30]);

  const initialMinPrice = useMemo(() => {
    if (allTours.length === 0) return 0;
    return Math.min(...allTours.map(t => t.price));
  }, [allTours]);

  const initialMaxPrice = useMemo(() => {
    if (allTours.length === 0) return 1;
    return Math.max(...allTours.map(t => t.price));
  }, [allTours]);

   useEffect(() => {
    if (allTours.length > 0) {
      setPriceRange([initialMinPrice, initialMaxPrice]);
    }
  }, [allTours, initialMinPrice, initialMaxPrice]);

  useEffect(() => {
    const fetchTours = () => {
      setIsLoading(true);
      const tours = getTourPackages();
      setAllTours(tours);
      setFilteredTours(tours); // Initially show all
      setIsLoading(false);
    };
    fetchTours();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const tourStyles = [
    { label: "Deluxe", count: allTours.filter(t => t.tourType.includes("Deluxe")).length },
    { label: "Premium", count: allTours.filter(t => t.tourType.includes("Premium")).length },
    { label: "Ultralux", count: allTours.filter(t => t.tourType.includes("Ultralux")).length },
    { label: "Signature Series", count: allTours.filter(t => t.tourType.includes("Signature")).length },
  ];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Filter By</h2>
            <div className="space-y-6">
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="font-semibold text-gray-700 w-full text-left">Price</CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-3">
                  <Slider
                    value={priceRange}
                    min={initialMinPrice}
                    max={initialMaxPrice}
                    step={1000}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{currencySymbol}{priceRange[0].toLocaleString('en-IN')}</span>
                    <span>{currencySymbol}{priceRange[1].toLocaleString('en-IN')}</span>
                  </div>
                   <div className="flex items-center space-x-2">
                    <Checkbox id="on-sale" />
                    <Label htmlFor="on-sale" className="text-sm font-normal text-gray-700">On Sale</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                    <Checkbox id="limited-time" />
                    <Label htmlFor="limited-time" className="text-sm font-normal text-gray-700">Limited time exclusive</Label>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Separator />
               <Collapsible defaultOpen>
                <CollapsibleTrigger className="font-semibold text-gray-700 w-full text-left">Duration</CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-3">
                  <Slider
                    defaultValue={[1, 30]}
                    min={1}
                    max={30}
                    step={1}
                    value={durationRange}
                    onValueChange={(value) => setDurationRange(value as [number, number])}
                  />
                  <div className="text-center text-sm text-gray-600">
                    {durationRange[0]} days - {durationRange[1]} days
                  </div>
                </CollapsibleContent>
              </Collapsible>
               <Separator />
               <Collapsible defaultOpen>
                <CollapsibleTrigger className="font-semibold text-gray-700 w-full text-left">Tour Style</CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-2">
                  {tourStyles.map(style => (
                    <div key={style.label} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`style-${style.label}`} />
                        <Label htmlFor={`style-${style.label}`} className="text-sm font-normal text-gray-700">{style.label}</Label>
                      </div>
                      <span className="text-sm text-gray-500">({style.count})</span>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
              <h3 className="text-gray-700">Showing {filteredTours.length} tours</h3>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center rounded-full border border-gray-300">
                      <Button variant="ghost" className="rounded-l-full bg-gray-800 text-white h-9 px-4 hover:bg-gray-700">Total price</Button>
                      <Button variant="ghost" className="rounded-r-full h-9 px-4 text-gray-600 hover:bg-gray-100">Price per day</Button>
                  </div>
                  <Select defaultValue="recommended">
                      <SelectTrigger className="w-[180px] h-9 border-gray-300">
                          <SelectValue placeholder="Sort: Recommended" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="recommended">Sort: Recommended</SelectItem>
                          <SelectItem value="price_asc">Price: Low to High</SelectItem>
                          <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      </SelectContent>
                  </Select>
                   <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Filter By</SheetTitle>
                            </SheetHeader>
                             {/* Mobile Filters would go here */}
                        </SheetContent>
                    </Sheet>
                  </div>
              </div>
            </div>

            <div className="space-y-6">
              {filteredTours.map(tour => (
                <TourListItem key={tour.id} tour={tour} currencySymbol={currencySymbol} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


export default function TourSearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <TourSearchResultsContent />
    </Suspense>
  );
}
