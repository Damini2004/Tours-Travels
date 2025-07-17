
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Map, SlidersHorizontal, ChevronDown, Hotel, Ship, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { UltraLuxPackage } from '@/lib/types';
import { getUltraLuxPackages } from '@/lib/hotel-data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const gradientTextClass = "bg-gradient-to-br from-stone-800 via-stone-600 to-stone-500 bg-clip-text text-transparent";
const defaultHotelImage = 'https://media.istockphoto.com/id/1197480605/photo/3d-render-of-luxury-hotel-lobby-and-reception.jpg?s=612x612&w=0&k=20&c=h2DMumrFFZDGqPypcK4Whx8mM1EdCKWh8PLY2saLIzo=';
const defaultHotelHint = 'hotel lobby';

const getRatingLabel = (rating: number): string => {
  if (rating >= 9.5) return "Exceptional";
  if (rating >= 9.0) return "Excellent";
  if (rating >= 8.5) return "Very Good";
  if (rating >= 8.0) return "Good";
  if (rating > 0) return "Okay";
  return "Not Rated";
};

export default function UltraLuxPage() {
  const [packages, setPackages] = useState<UltraLuxPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedOffers, setSavedOffers] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchedPackages = getUltraLuxPackages();
    setPackages(fetchedPackages);
    setIsLoading(false);
  }, []);

  const toggleSaveOffer = (offerId: string) => {
    setSavedOffers(prev => ({ ...prev, [offerId]: !prev[offerId] }));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const calculateDiscount = (price: number, originalPrice: number) => {
      if (originalPrice <= price) return 0;
      return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  return (
    <div className="bg-white text-stone-800">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[300px] w-full flex items-center justify-center text-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop"
          alt="Serene ocean view"
          layout="fill"
          objectFit="cover"
          className="filter brightness-75"
          data-ai-hint="serene ocean"
        />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-light tracking-widest">
            ULTRA<span className="font-bold">LUX</span>
          </h1>
          <p className="mt-2 text-lg md:text-xl font-light text-white/90">
            Experience the world's most luxurious hotels & tours
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <Tabs defaultValue="hotels" className="w-full max-w-sm mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm shadow-lg rounded-full border">
            <TabsTrigger value="hotels" className="rounded-full data-[state=active]:bg-stone-800 data-[state=active]:text-white"><Hotel className="mr-2 h-4 w-4" /> Ultra Lux Hotels</TabsTrigger>
            <TabsTrigger value="tours" className="rounded-full data-[state=active]:bg-stone-800 data-[state=active]:text-white"><Ship className="mr-2 h-4 w-4"/> Ultra Lux Tours</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div className="flex items-center gap-4">
            <Image
              src="https://images.unsplash.com/photo-1563911302254-52358896940a?q=80&w=400"
              alt="Hotel concierge bell"
              width={80}
              height={80}
              className="rounded-lg object-cover h-20 w-20"
              data-ai-hint="hotel concierge"
            />
            <div>
              <h3 className="font-semibold text-stone-700">Exceptional 5 & 6 star properties</h3>
              <p className="text-sm text-stone-500">Get access to exclusive luxury hotels around the world</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="https://images.unsplash.com/photo-1551846024-e2d63c52dae2?q=80&w=400"
              alt="Concierge service"
              width={80}
              height={80}
              className="rounded-lg object-cover h-20 w-20"
              data-ai-hint="customer service"
            />
            <div>
              <h3 className="font-semibold text-stone-700">Premium concierge service</h3>
              <p className="text-sm text-stone-500">Our team are available anytime, 9am to 7pm, 7 days a week.</p>
              <p className="text-sm font-semibold text-stone-800 mt-1">Call +91 803 783 5334</p>
            </div>
          </div>
        </div>

        {/* Explore Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className={`text-3xl font-light ${gradientTextClass}`}>Explore our <span className="font-semibold">ultra lux</span> hotels</h2>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button variant="outline" className="text-stone-600 border-stone-300"><SlidersHorizontal className="mr-2 h-4 w-4" /> Filter offers</Button>
              <Button variant="outline" className="text-stone-600 border-stone-300">Sort: Recommended <ChevronDown className="ml-2 h-4 w-4" /></Button>
              <Button variant="outline" className="text-stone-600 border-stone-300"><Map className="mr-2 h-4 w-4" /> Map view</Button>
            </div>
          </div>

           <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-6 -mx-4 px-4 pb-4">
             {isLoading ? (
                <p>Loading packages...</p>
            ) : packages.length > 0 ? (
                packages.map((pkg) => {
                   const discount = calculateDiscount(pkg.price, pkg.originalPrice);
                   return (
                    <Card
                      key={pkg.id}
                      className="group/card w-[85vw] sm:w-[45vw] lg:w-[31%] flex-shrink-0 bg-white border-gray-200 flex flex-col justify-between h-full rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1"
                    >
                      <div className="relative">
                        <Badge variant="default" className="absolute top-3 left-3 z-10 bg-black/60 text-white border-none rounded-full">
                           ULTRA-LUX
                        </Badge>
                        <button
                            onClick={() => toggleSaveOffer(pkg.id)}
                            aria-label={savedOffers[pkg.id] ? "Unsave offer" : "Save offer"}
                            className="absolute top-2.5 right-2.5 z-10 text-white bg-black/50 backdrop-blur-sm border-none rounded-full p-1.5 cursor-pointer transition-colors duration-300 hover:text-red-400"
                        >
                            <Heart className={cn("h-5 w-5", savedOffers[pkg.id] && "fill-red-500 text-red-500")} />
                        </button>
                        <div className="w-full h-56 relative rounded-t-lg overflow-hidden">
                          <Image
                            src={pkg.imageUrl || defaultHotelImage}
                            alt={pkg.title}
                            layout="fill"
                            objectFit="cover"
                            className="group-hover/card:scale-105 transition-transform duration-300"
                            data-ai-hint={pkg.imageHint || defaultHotelHint}
                          />
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                          <p className="uppercase text-xs font-semibold text-gray-500">{pkg.brand}</p>
                          <p className="text-xs text-gray-400 mb-1">{pkg.location}</p>
                          <h3 className="font-semibold text-sm leading-snug text-gray-800 h-16 line-clamp-3">
                              {pkg.title}
                          </h3>
                          
                          <div className="mt-auto pt-2">
                              <p className="text-xs text-gray-500 mb-2">{pkg.nights} nights from (room only)</p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-800">₹{pkg.price.toLocaleString('en-IN')}</span>
                                <s className="text-sm text-gray-400">₹{pkg.originalPrice.toLocaleString('en-IN')}</s>
                                {discount > 0 && <span className="text-xs font-bold text-green-600">{discount}% OFF</span>}
                              </div>
                              <Button asChild className="mt-4 w-full h-11 bg-stone-800 hover:bg-stone-700 text-white text-base py-6">
                                  <Link href="#">View Offer</Link>
                              </Button>
                          </div>
                      </div>
                    </Card>
                );
            })
            ) : (
                <div className="text-center py-16 w-full">
                    <h3 className="text-xl font-semibold text-stone-700">No Ultra Lux Packages Available</h3>
                    <p className="text-stone-500">Please check back later for exclusive deals.</p>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
