"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, UsersIcon, SearchIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <Card className="w-full shadow-lg p-4 mb-8">
            <div className="h-40 bg-muted/30 rounded-md animate-pulse"></div>
        </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg p-4">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
            
            <div className="lg:col-span-2 space-y-1">
              <Label htmlFor="location" className="text-sm font-medium text-muted-foreground">Location</Label>
              <Input
                id="location"
                placeholder="City, Property name or Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="checkin-date" className="text-sm font-medium text-muted-foreground">Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-12 justify-start text-left font-normal">
                    <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? (
                            <div>
                                <p className="text-base font-semibold leading-none">{format(checkInDate, 'dd')}</p>
                                <p className="text-xs text-muted-foreground">{format(checkInDate, 'MMM yy, EEE')}</p>
                            </div>
                        ) : <span>Pick a date</span>}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} /></PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label htmlFor="checkout-date" className="text-sm font-medium text-muted-foreground">Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                   <Button variant="outline" className="w-full h-12 justify-start text-left font-normal">
                     <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate ? (
                            <div>
                                <p className="text-base font-semibold leading-none">{format(checkOutDate, 'dd')}</p>
                                <p className="text-xs text-muted-foreground">{format(checkOutDate, 'MMM yy, EEE')}</p>
                            </div>
                        ) : <span>Pick a date</span>}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} disabled={(date) => checkInDate ? date <= checkInDate : date < new Date(new Date().setHours(0,0,0,0))} /></PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="guests-rooms" className="text-sm font-medium text-muted-foreground">Rooms & Guests</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-12 justify-start text-left font-normal">
                    <UsersIcon className="mr-2 h-4 w-4" />
                    <div>
                        <p className="text-base font-semibold leading-none">{rooms} Room, {adults} Adults</p>
                    </div>
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
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
            <div className="space-y-1 w-full md:w-1/3">
              <Label htmlFor="price-range" className="text-sm font-medium text-muted-foreground">Price per night</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger id="price-range" className="h-11">
                  <SelectValue placeholder="Select a price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1500">₹0 - ₹1500</SelectItem>
                  <SelectItem value="1500-2500">₹1500 - ₹2500</SelectItem>
                  <SelectItem value="2500-5000">₹2500 - ₹5000</SelectItem>
                  <SelectItem value="5000+">₹5000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full md:w-auto h-12 text-base px-10 bg-accent text-accent-foreground hover:bg-accent/90">
                <SearchIcon className="mr-2 h-5 w-5" /> Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
