
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
import { useRouter } from 'next/navigation';

const trendingDestinations = [
  { name: 'Thailand', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070&auto=format&fit=crop', hint: 'thailand temple', price: 35200 },
  { name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop', hint: 'dubai skyline', price: 10600 },
  { name: 'Vietnam', image: 'https://images.unsplash.com/photo-1526481280643-33c3366ab42f?q=80&w=2070&auto=format&fit=crop', hint: 'vietnam town', price: 12600 },
  { name: 'Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c611474343?q=80&w=1974&auto=format&fit=crop', hint: 'malaysia petronas towers', price: 39600 },
  { name: 'Maldives', image: 'https://images.unsplash.com/photo-1516406742384-26c71f3917a8?q=80&w=2070&auto=format&fit=crop', hint: 'maldives overwater villas', price: 28500 },
  { name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1974&auto=format&fit=crop', hint: 'singapore marina bay', price: 50200 },
  { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df97525d?q=80&w=1935&auto=format&fit=crop', hint: 'bali rice terraces', price: 63800 },
  { name: 'Turkey', image: 'https://images.unsplash.com/photo-1569383971294-f15598836371?q=80&w=1964&auto=format&fit=crop', hint: 'turkey hot air balloons', price: 45000 },
  { name: 'Egypt', image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?q=80&w=1935&auto=format&fit=crop', hint: 'egypt pyramids', price: 55000 },
  { name: 'Greece', image: 'https://images.unsplash.com/photo-1533105079780-52b9be4ac20c?q=80&w=1974&auto=format&fit=crop', hint: 'greece santorini', price: 62000 },
  { name: 'Italy', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1966&auto=format&fit=crop', hint: 'italy coast town', price: 58000 },
  { name: 'Mexico', image: 'https://images.unsplash.com/photo-1518638150340-f706e8665191?q=80&w=2070&auto=format&fit=crop', hint: 'mexico beach', price: 48000 },
];

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

export default function ToursPage() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [savedTours, setSavedTours] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trendingScrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    const params = new URLSearchParams();
    if (searchDestination) {
      params.set('destination', searchDestination);
    }
    router.push(`/tours/search?${params.toString()}`);
  }

  const months = ["July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-white text-[#155e63]">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex flex-col items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop')" }} data-ai-hint="italy coast travel">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Tour the world with us</h1>
          <p className="mt-2 text-lg text-gray-200">Wander more with curated small-group adventures to destinations across the globe.</p>
          
           {/* New Search Bar */}
          <div className="mt-8 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg flex items-center gap-2 max-w-xl mx-auto border border-gray-300">
              <div className="flex-grow flex items-center gap-2 pl-4">
                 <Search className="w-5 h-5 text-gray-500" />
                <Input 
                    type="text" 
                    placeholder="Search destination or place" 
                    className="w-full border-none p-0 h-auto text-gray-800 focus-visible:ring-0 text-base bg-transparent"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                />
              </div>
              <div className="w-px h-6 bg-gray-300 self-center"></div>
               <Popover open={isWhenPopoverOpen} onOpenChange={setIsWhenPopoverOpen}>
                    <PopoverTrigger asChild>
                        <button className="text-left px-4 py-1.5 rounded-full hover:bg-gray-100/80 transition-colors">
                            <label className="text-xs font-bold text-gray-600 block">When?</label>
                            <span className="text-gray-800 text-sm">{displayWhen}</span>
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
                                                <Button key={d.id} variant={selectedDuration === d.id ? 'default' : 'outline'} onClick={() => setSelectedDuration(d.id)} className={cn("flex-col h-auto py-2", selectedDuration === d.id && "bg-[#155e63] text-white")}>
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
                            <Button className="bg-[#155e63] text-white hover:bg-[#155e63]/90" onClick={handleApplyWhen}>Apply</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            <Button className="bg-white text-[#155e63] border border-[#155e63]/50 hover:bg-gray-100 rounded-full w-11 h-11 flex-shrink-0" size="icon" onClick={handleSearch}>
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
              <Button variant="outline" size="icon" className="rounded-full border-white/30 text-white" onClick={() => scroll('left', scrollContainerRef)}>
                  <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-white/30 text-white" onClick={() => scroll('right', scrollContainerRef)}>
                  <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-6 -mx-4 px-4 pb-2">
            {tours.map((tour) => {
              const discount = calculateDiscountPercent(tour.price, tour.originalPrice);
              return (
                <div key={tour.id} className="bg-white border border-[#155e63]/20 rounded-lg flex flex-col group w-[300px] h-[450px] flex-shrink-0">
                  <div className="relative">
                    <Image src={tour.imageUrl} alt={tour.title} width={300} height={224} className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-90 transition-opacity" data-ai-hint={tour.imageHint} />
                    <Button size="sm" onClick={() => toggleSave(tour.id)} className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-lg h-8 w-auto px-3 backdrop-blur-sm text-gray-700 font-semibold text-xs">
                      <Heart className={cn("h-4 w-4 mr-1.5", savedTours[tour.id] && 'text-red-500 fill-current')} />
                      Save
                    </Button>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <p className="text-xs text-[#155e63]/80">{tour.location}</p>
                    <p className="text-xs text-[#155e63] font-semibold">{tour.tourType}</p>
                    <h3 className="text-sm font-semibold mt-1 flex-grow text-[#155e63] group-hover:text-[#155e63]/80 transition-colors h-12 overflow-hidden">{tour.title}</h3>
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
                      <Button asChild variant="outline" className="w-full border-[#155e63] text-[#155e63] hover:bg-white">
                        <Link href="/tours/search">View offer</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tours Catalogue */}
          <div className="my-16 bg-[#eaf4f4] p-6 rounded-lg flex flex-col sm:flex-row justify-between items-center shadow-lg">
            <div className="flex items-center gap-4">
              <Image src="https://placehold.co/100x100/155e63/FFFFFF.png" alt="Catalogue" width={80} height={80} className="rounded-md" data-ai-hint="travel magazine cover" />
              <div>
                <h3 className="text-xl font-bold text-[#155e63]">Tours Catalogue</h3>
                <p className="text-gray-600">Go beyond the ordinary and discover the difference.</p>
              </div>
            </div>
            <Button variant="secondary" className="mt-4 sm:mt-0 bg-white text-[#155e63] border border-[#155e63] hover:bg-gray-100">View Now</Button>
          </div>

          {/* Trending Destinations - New Design */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Immerse yourself in trending destinations</h2>
                <div className="hidden md:flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm" onClick={() => scroll('left', trendingScrollRef)}>
                        <ChevronLeft className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm" onClick={() => scroll('right', trendingScrollRef)}>
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                    </Button>
                </div>
            </div>
            <div ref={trendingScrollRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-4 -mx-4 px-4 pb-2">
              {trendingDestinations.map(dest => (
                <Link href="#" key={dest.name} className="block group text-left flex-shrink-0 w-48">
                  <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-2 shadow-md">
                    <Image src={dest.image} alt={dest.name} layout="fill" objectFit="cover" data-ai-hint={dest.hint} className="group-hover:scale-105 transition-transform" />
                  </div>
                  <p className="text-base font-bold text-gray-800 group-hover:text-[#155e63]">{dest.name}</p>
                  <p className="text-sm text-gray-500">Starting at ₹{dest.price.toLocaleString('en-IN')} Per person</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
