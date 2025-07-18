
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Heart, Search } from 'lucide-react';
import type { TourPackage } from '@/lib/types';
import { getTourPackages } from '@/lib/tour-data';
import Link from 'next/link';

const trendingDestinations = [
  { name: 'Africa', image: 'https://placehold.co/150x200.png', hint: 'africa wildlife' },
  { name: 'Australia', image: 'https://placehold.co/150x200.png', hint: 'australia landmark' },
  { name: 'Vietnam', image: 'https://placehold.co/150x200.png', hint: 'vietnam landscape' },
  { name: 'India', image: 'https://placehold.co/150x200.png', hint: 'india monument' },
  { name: 'Japan', image: 'https://placehold.co/150x200.png', hint: 'japan temple' },
  { name: 'Spain', image: 'https://placehold.co/150x200.png', hint: 'spain city' },
  { name: 'Sri Lanka', image: 'https://placehold.co/150x200.png', hint: 'sri lanka beach' },
  { name: 'Turkey', image: 'https://placehold.co/150x200.png', hint: 'turkey architecture' },
  { name: 'Egypt', image: 'https://placehold.co/150x200.png', hint: 'egypt pyramids' },
];

export default function ToursPage() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [savedTours, setSavedTours] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadedTours = getTourPackages();
    setTours(loadedTours);
  }, []);

  const toggleSave = (tourId: string) => {
    setSavedTours(prev => ({ ...prev, [tourId]: !prev[tourId] }));
  };
  
  const calculateDiscountPercent = (price: number, originalPrice: number) => {
    if (originalPrice <= 0 || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="bg-[#1a202c] text-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex flex-col items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }} data-ai-hint="ancient library scrolls">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Tour the world with us</h1>
          <p className="mt-2 text-lg text-gray-200">Wander more with curated small-group adventures to destinations across the globe.</p>
          <div className="mt-6 bg-white p-2 rounded-lg shadow-lg flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <Input type="text" placeholder="Search destination or place" className="flex-grow text-gray-800" />
            <Input type="text" placeholder="When?" className="w-full sm:w-auto text-gray-800" />
            <Button className="bg-gray-800 hover:bg-gray-900 w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Today's top exclusive offers */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Today's top exclusive offers</h2>
          <Button variant="link" className="text-white hover:text-gray-300">View all</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tours.map((tour) => {
            const discount = calculateDiscountPercent(tour.price, tour.originalPrice);
            return (
              <Card key={tour.id} className="bg-[#2d3748] border-gray-700 rounded-lg overflow-hidden flex flex-col group">
                <div className="relative">
                  <Image src={tour.imageUrl} alt={tour.title} width={300} height={200} className="w-full h-40 object-cover" data-ai-hint={tour.imageHint} />
                  <Button size="icon" onClick={() => toggleSave(tour.id)} className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full h-8 w-8">
                    <Heart className={`h-4 w-4 ${savedTours[tour.id] ? 'text-red-500 fill-current' : 'text-white'}`} />
                  </Button>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <p className="text-xs text-gray-400">{tour.location}</p>
                  <p className="text-xs text-gray-300 font-semibold">{tour.tourType}</p>
                  <h3 className="text-sm font-semibold mt-1 flex-grow group-hover:text-gray-300 transition-colors">{tour.title}</h3>
                  <div className="mt-4">
                    <p className="text-xs text-gray-400">{tour.durationDays} days from</p>
                    <p className="text-lg font-bold">₹{tour.price.toLocaleString('en-IN')}<span className="text-xs font-normal"> person</span></p>
                    <div className="flex items-center text-xs text-gray-400">
                      <span>Valued up to ₹{tour.originalPrice.toLocaleString('en-IN')}</span>
                      {discount > 0 && <span className="ml-2 bg-green-500 text-white text-xxs font-bold px-1.5 py-0.5 rounded-full">{discount}%</span>}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent border-gray-500 hover:bg-gray-700/50 hover:text-white">View offer</Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tours Catalogue */}
        <div className="my-16 bg-[#2d3748] p-6 rounded-lg flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <Image src="https://placehold.co/100x100.png" alt="Catalogue" width={80} height={80} className="rounded-md" data-ai-hint="travel magazine cover" />
            <div>
              <h3 className="text-xl font-bold">Tours Catalogue</h3>
              <p className="text-gray-300">Go beyond the ordinary and discover the difference.</p>
            </div>
          </div>
          <Button variant="secondary" className="mt-4 sm:mt-0 bg-gray-200 text-gray-800 hover:bg-gray-300">View Now</Button>
        </div>

        {/* Trending Destinations */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Immerse yourself in trending destinations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-4">
            {trendingDestinations.map(dest => (
              <Link href="#" key={dest.name} className="block group text-center">
                <div className="relative w-full aspect-square rounded-full overflow-hidden mb-2 transform group-hover:scale-105 transition-transform">
                  <Image src={dest.image} alt={dest.name} layout="fill" objectFit="cover" data-ai-hint={dest.hint} />
                </div>
                <p className="text-sm font-semibold group-hover:underline">{dest.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
