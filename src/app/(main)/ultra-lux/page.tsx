"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Map, SlidersHorizontal, ChevronDown, Hotel, Ship, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UltraLuxPackage } from '@/lib/types';
import { getUltraLuxPackages } from '@/lib/hotel-data'; // Assuming this function will be created
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const gradientTextClass = "bg-gradient-to-br from-stone-800 via-stone-600 to-stone-500 bg-clip-text text-transparent";

export default function UltraLuxPage() {
  const [packages, setPackages] = useState<UltraLuxPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this data. For now, we'll use local data.
    const fetchedPackages = getUltraLuxPackages();
    setPackages(fetchedPackages);
    setIsLoading(false);
  }, []);

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

          <div className="space-y-8">
            {isLoading ? (
                <p>Loading packages...</p>
            ) : packages.length > 0 ? (
              packages.map((pkg) => (
                <Card key={pkg.id} className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden shadow-xl border-stone-200/80">
                  <div className="relative min-h-[300px] group">
                    <Image
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={pkg.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                     <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        1/10
                    </div>
                     <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="icon" className="rounded-full bg-white/70 hover:bg-white"><ChevronLeft/></Button>
                        <Button variant="outline" size="icon" className="rounded-full bg-white/70 hover:bg-white"><ChevronRight/></Button>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="border-stone-400 text-stone-500 font-light tracking-widest text-xs">ULTRA-LUX</Badge>
                        <h3 className="text-3xl font-semibold text-stone-800 mt-4">{pkg.brand}</h3>
                        <p className="text-stone-500">{pkg.location}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-stone-500 hover:text-red-500">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="mt-4 text-stone-600 text-sm flex-grow">{pkg.title}</p>
                    <div className="mt-6 text-right">
                      <p className="text-sm text-stone-500">{pkg.nights} nights from (room only)</p>
                      <p className={`text-4xl font-bold ${gradientTextClass}`}>
                        ₹{pkg.price.toLocaleString()}
                      </p>
                      <div className="text-xs text-stone-400 mt-1">
                        Valued up to <s className="text-stone-400">₹{pkg.originalPrice.toLocaleString()}</s> 
                        <Badge variant="destructive" className="ml-2 bg-red-100 text-red-600 border border-red-200">
                           {(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-stone-500 hover:underline cursor-pointer mt-1">Price details</p>
                    </div>
                    <Button asChild size="lg" className="mt-6 w-full bg-stone-800 hover:bg-stone-700 text-white text-base py-6">
                        <Link href="#">View Offer</Link>
                    </Button>
                    <p className="text-center text-xs text-stone-500 mt-2">Hotel + flights packages available</p>
                  </div>
                </Card>
              ))
            ) : (
                <div className="text-center py-16">
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
