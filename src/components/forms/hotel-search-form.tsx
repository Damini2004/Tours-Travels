
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, UsersIcon, SearchIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';

export function HotelSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get('location') || '');
  
  const getInitialDate = (param: string | null): Date | undefined => {
    if (!param) return undefined;
    const date = parseISO(param);
    return isValid(date) ? date : undefined;
  }

  const [checkInDate, setCheckInDate] = useState<Date | undefined>(getInitialDate(searchParams.get('checkInDate')));
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(getInitialDate(searchParams.get('checkOutDate')));
  
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(parseInt(searchParams.get('guests') || '2'));
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (location) queryParams.set('location', location);
    if (checkInDate) queryParams.set('checkInDate', format(checkInDate, 'yyyy-MM-dd'));
    if (checkOutDate) queryParams.set('checkOutDate', format(checkOutDate, 'yyyy-MM-dd'));
    queryParams.set('guests', String(adults));
    if (priceRange) queryParams.set('price', priceRange);

    router.push(`/hotels/search?${queryParams.toString()}`);
  };

  const handleGuestChange = (type: 'rooms' | 'adults', operation: 'increment' | 'decrement') => {
    if (type === 'rooms') {
      setRooms(prev => operation === 'increment' ? prev + 1 : Math.max(1, prev - 1));
    } else {
      setAdults(prev => operation === 'increment' ? prev + 1 : Math.max(1, prev - 1));
    }
  };

  if (!isClient) {
    return (
        <div className="w-full p-4 mb-8">
            <div className="h-28 bg-gradient-to-r from-[#031f2d] via-[#0c4d52] to-[#155e63] rounded-xl animate-pulse"></div>
        </div>
    );
  }

  return (
    <div className="w-full shadow-lg p-3 rounded-xl bg-gradient-to-r from-[#031f2d] via-[#0c4d52] to-[#155e63]">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2 items-end">
            
            <div className="lg:col-span-3 space-y-1">
              <Label htmlFor="location" className="text-xs font-medium text-gray-300 px-1">Location</Label>
              <Input
                id="location"
                placeholder="City, Property or Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="h-11 text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-sky-300"
              />
            </div>

            <div className="lg:col-span-2 space-y-1">
              <Label htmlFor="checkin-date" className="text-xs font-medium text-gray-300 px-1">Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-11 justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
                     <CalendarIcon className="mr-2 h-4 w-4" />
                     {checkInDate ? format(checkInDate, 'dd MMM yy') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} /></PopoverContent>
              </Popover>
            </div>

            <div className="lg:col-span-2 space-y-1">
              <Label htmlFor="checkout-date" className="text-xs font-medium text-gray-300 px-1">Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                   <Button variant="outline" className="w-full h-11 justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
                     <CalendarIcon className="mr-2 h-4 w-4" />
                     {checkOutDate ? format(checkOutDate, 'dd MMM yy') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} disabled={(date) => checkInDate ? date <= checkInDate : date < new Date(new Date().setHours(0,0,0,0))} /></PopoverContent>
              </Popover>
            </div>
            
            <div className="lg:col-span-2 space-y-1">
              <Label htmlFor="guests-rooms" className="text-xs font-medium text-gray-300 px-1">Rooms & Guests</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-11 justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
                    <UsersIcon className="mr-2 h-4 w-4" />
                    <span>{rooms} Room, {adults} Adults</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Rooms</Label>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleGuestChange('rooms', 'decrement')}><MinusIcon className="h-4 w-4" /></Button>
                        <span className="w-4 text-center">{rooms}</span>
                        <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleGuestChange('rooms', 'increment')}><PlusIcon className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Adults</Label>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleGuestChange('adults', 'decrement')}><MinusIcon className="h-4 w-4" /></Button>
                        <span className="w-4 text-center">{adults}</span>
                        <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleGuestChange('adults', 'increment')}><PlusIcon className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="lg:col-span-2 space-y-1">
              <Label htmlFor="price-range" className="text-xs font-medium text-gray-300 px-1">Price per night</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger id="price-range" className="w-full h-11 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white [&>svg]:text-white">
                  <SelectValue placeholder="Select a price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1500">₹0 - ₹1500</SelectItem>
                  <SelectItem value="1500-2500">₹1500 - ₹2500</SelectItem>
                  <SelectItem value="2500-5000">₹2500 - ₹5000</SelectItem>
                  <SelectItem value="5000+">₹5000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full lg:col-span-1 h-11 text-base px-10 bg-accent text-accent-foreground hover:bg-accent/90">
                <SearchIcon className="mr-2 h-5 w-5" /> Search
            </Button>
          </div>
        </form>
    </div>
  );
}
