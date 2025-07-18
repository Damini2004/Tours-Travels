
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Heart, Search, Ship, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import type { TourPackage } from '@/lib/types';
import { getTourPackages } from '@/lib/tour-data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
  { name: 'Greece', image: 'https://placehold.co/150x200.png', hint: 'greece santorini' },
  { name: 'Italy', image: 'https://placehold.co/150x200.png', hint: 'italy colosseum' },
  { name: 'Mexico', image: 'https://placehold.co/150x200.png', hint: 'mexico beach' },
];

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

export default function ToursPage() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [savedTours, setSavedTours] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trendingScrollRef = useRef<HTMLDivElement>(null);

  // State for the new search bar
  const [searchDestination, setSearchDestination] = useState('');
  const [isWhenPopoverOpen, setIsWhenPopoverOpen] = useState(false);
  const [activeDateTab, setActiveDateTab] = useState('flexible');
  const [selectedDuration, setSelectedDuration] = useState('any');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [displayWhen, setDisplayWhen] = useState("I'm flexible");


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

  const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.8;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  const handleApplyWhen = () => {
    if (activeDateTab === 'anytime') {
      setDisplayWhen('Anytime');
    } else {
      if (selectedMonth) {
        setDisplayWhen(`${selectedMonth} ${selectedYear}`);
      } else {
        setDisplayWhen("I'm flexible");
      }
    }
    setIsWhenPopoverOpen(false);
  };

  const handleSearch = () => {
    // In a real app, you would use searchDestination, selectedDuration, selectedYear, selectedMonth to filter results.
    alert(`Searching for:\nDestination: ${searchDestination}\nWhen: ${displayWhen}\nDuration: ${selectedDuration}`);
  }

  const months = ["July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-white text-[#155e63]">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex flex-col items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }} data-ai-hint="ancient library scrolls">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Tour the world with us</h1>
          <p className="mt-2 text-lg text-gray-200">Wander more with curated small-group adventures to destinations across the globe.</p>
          
           {/* New Search Bar */}
          <div className="mt-8 bg-white p-2 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto border">
            <div className="flex-grow p-2">
                <label className="text-xs font-bold text-gray-600 block text-left">Where</label>
                <Input 
                    type="text" 
                    placeholder="Search destination or place" 
                    className="w-full border-none p-0 h-auto text-gray-800 focus-visible:ring-0 text-base"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                />
            </div>
            <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
            <div className="flex-grow p-2">
                 <Popover open={isWhenPopoverOpen} onOpenChange={setIsWhenPopoverOpen}>
                    <PopoverTrigger asChild>
                        <button className="w-full text-left">
                            <label className="text-xs font-bold text-gray-600 block">When?</label>
                            <span className="text-gray-800 text-base">{displayWhen}</span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[500px] p-4 mt-2" align="start">
                        <Tabs value={activeDateTab} onValueChange={setActiveDateTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="flexible">Flexible dates</TabsTrigger>
                                <TabsTrigger value="anytime">Anytime</TabsTrigger>
                            </TabsList>
                            <TabsContent value="flexible" className="mt-4">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">How long?</h4>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[{id: 'any', label: 'Any duration', sub: 'I\'ll decide later'}, {id: 'short', label: 'Short tour', sub: '1 to 7 days'}, {id: 'medium', label: 'Medium tour', sub: '8 to 14 days'}, {id: 'long', label: 'Long tour', sub: '15+ days'}].map(d => (
                                                <Button key={d.id} variant={selectedDuration === d.id ? 'default' : 'outline'} onClick={() => setSelectedDuration(d.id)} className={cn("flex-col h-auto py-2", selectedDuration === d.id && "bg-gray-800 text-white")}>
                                                    <span className="text-sm font-semibold">{d.label}</span>
                                                    <span className="text-xs font-normal">{d.sub}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                     <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">When?</h4>
                                        <div className="flex justify-center items-center gap-4 mb-2">
                                            <Button variant="ghost" size="icon" onClick={() => setSelectedYear(y => y - 1)}><ChevronLeft className="w-4 h-4"/></Button>
                                            <span className="font-semibold">{selectedYear}</span>
                                            <Button variant="ghost" size="icon" onClick={() => setSelectedYear(y => y + 1)}><ChevronRight className="w-4 h-4"/></Button>
                                        </div>
                                        <RadioGroup value={selectedMonth} onValueChange={setSelectedMonth} className="grid grid-cols-6 gap-2">
                                            {months.map(month => (
                                                <div key={month} className="flex items-center justify-center">
                                                    <RadioGroupItem value={month} id={`month-${month}`} className="sr-only peer" />
                                                    <Label htmlFor={`month-${month}`} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full">
                                                        {month}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                </div>
                            </TabsContent>
                             <TabsContent value="anytime" className="mt-4 text-center text-gray-600">
                                <p>Search for tours happening anytime.</p>
                            </TabsContent>
                        </Tabs>
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                            <Button variant="ghost" onClick={() => setIsWhenPopoverOpen(false)}>Cancel</Button>
                            <Button className="bg-gray-800 text-white hover:bg-gray-700" onClick={handleApplyWhen}>Apply</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <Button className="bg-gray-800 text-white rounded-full w-12 h-12 flex-shrink-0" size="icon" onClick={handleSearch}>
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Today's top exclusive offers */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#155e63]">Today's top <i className="font-serif">exclusive</i> offers</h2>
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full border-[#155e63]/30 text-[#155e63]" onClick={() => scroll('left', scrollContainerRef)}>
                  <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-[#155e63]/30 text-[#155e63]" onClick={() => scroll('right', scrollContainerRef)}>
                  <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-6 -mx-4 px-4 pb-2">
            {tours.map((tour) => {
              const discount = calculateDiscountPercent(tour.price, tour.originalPrice);
              return (
                <div key={tour.id} className="bg-white border border-[#155e63]/20 rounded-lg flex flex-col group w-[90vw] sm:w-[50vw] md:w-[35vw] lg:w-[30vw] flex-shrink-0">
                  <div className="relative">
                    <Image src={tour.imageUrl} alt={tour.title} width={300} height={224} className="w-full h-72 object-cover rounded-t-lg group-hover:opacity-90 transition-opacity" data-ai-hint={tour.imageHint} />
                    <Button size="sm" onClick={() => toggleSave(tour.id)} className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-lg h-8 w-auto px-3 backdrop-blur-sm text-gray-700 font-semibold text-xs">
                      <Heart className={cn("h-4 w-4 mr-1.5", savedTours[tour.id] && 'text-red-500 fill-current')} />
                      Save
                    </Button>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <p className="text-xs text-[#155e63]/80">{tour.location}</p>
                    <p className="text-xs text-[#155e63] font-semibold">{tour.tourType}</p>
                    <h3 className="text-sm font-semibold mt-1 flex-grow text-[#155e63] group-hover:text-[#155e63]/80 transition-colors">{tour.title}</h3>
                    <div className="mt-auto pt-4">
                      <div className="mb-4">
                        <p className="text-xs text-[#155e63]/80">{tour.durationDays} days from</p>
                        <p className="text-lg font-bold text-[#155e63]">₹{tour.price.toLocaleString('en-IN')}<span className="text-xs font-normal text-[#155e63]/80"> /person</span></p>
                        <div className="flex items-center text-xs text-[#155e63]/70">
                          <span>Valued up to ₹{tour.originalPrice.toLocaleString('en-IN')}</span>
                          {discount > 0 && <span className="ml-2 bg-teal-500 text-white text-xxs font-bold px-1.5 py-0.5 rounded-sm">{discount}%</span>}
                        </div>
                        <p className="text-xs text-[#155e63]/70">Twin room</p>
                      </div>
                      <Button variant="outline" className="w-full border-[#155e63]/80 text-[#155e63] hover:bg-[#155e63] hover:text-white">
                        View offer
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tours Catalogue */}
          <div className="my-16 bg-[#155e63] border border-[#155e63] p-6 rounded-lg flex flex-col sm:flex-row justify-between items-center shadow-lg">
            <div className="flex items-center gap-4">
              <Image src="https://placehold.co/100x100/155e63/FFFFFF.png" alt="Catalogue" width={80} height={80} className="rounded-md" data-ai-hint="travel magazine cover" />
              <div>
                <h3 className="text-xl font-bold text-white">Tours Catalogue</h3>
                <p className="text-gray-300">Go beyond the ordinary and discover the difference.</p>
              </div>
            </div>
            <Button variant="secondary" className="mt-4 sm:mt-0 bg-gray-200 text-gray-800 hover:bg-white">View Now</Button>
          </div>

          {/* Trending Destinations */}
          <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#155e63]">Immerse yourself in trending destinations</h2>
                <div className="hidden md:flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full border-[#155e63]/30 text-[#155e63]" onClick={() => scroll('left', trendingScrollRef)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full border-[#155e63]/30 text-[#155e63]" onClick={() => scroll('right', trendingScrollRef)}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div ref={trendingScrollRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-4 -mx-4 px-4 pb-2">
              {trendingDestinations.map(dest => (
                <Link href="#" key={dest.name} className="block group text-center flex-shrink-0 w-28 sm:w-32">
                  <div className="relative w-full aspect-square rounded-full overflow-hidden mb-2 transform group-hover:scale-105 transition-transform">
                    <Image src={dest.image} alt={dest.name} layout="fill" objectFit="cover" data-ai-hint={dest.hint} />
                  </div>
                  <p className="text-sm font-semibold group-hover:underline text-[#155e63]">{dest.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
