"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, LightbulbIcon, SparklesIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { SuggestLocationsInput } from '@/ai/flows/suggest-locations';

interface AiSuggestionsFormProps {
  onSubmit: (data: SuggestLocationsInput) => Promise<void>;
  isLoading: boolean;
}

export function AiSuggestionsForm({ onSubmit, isLoading }: AiSuggestionsFormProps) {
  const [flightDestination, setFlightDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [interests, setInterests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightDestination || !departureDate || !returnDate) {
      // Basic validation, could use react-hook-form for more robust validation
      alert("Please fill in destination and dates.");
      return;
    }
    const flightDates = `${format(departureDate, 'yyyy-MM-dd')} to ${format(returnDate, 'yyyy-MM-dd')}`;
    onSubmit({ flightDestination, flightDates, interests });
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
            <SparklesIcon className="mr-2 h-6 w-6 text-primary" /> AI Travel Planner
        </CardTitle>
        <CardDescription>Get personalized hotel and location suggestions for your booked flight.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="flight-destination">Flight Destination</Label>
            <Input
              id="flight-destination"
              placeholder="e.g., Rome, Italy"
              value={flightDestination}
              onChange={(e) => setFlightDestination(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departure-date">Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } 
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-date">Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    disabled={(date) => departureDate ? date < departureDate : date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Your Interests (Optional)</Label>
            <Textarea
              id="interests"
              placeholder="e.g., history, art, food, hiking"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting Suggestions...
              </>
            ) : (
              <>
                <LightbulbIcon className="mr-2 h-5 w-5" /> Get AI Suggestions
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
