import type { SuggestLocationsOutput } from '@/ai/flows/suggest-locations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HotelIcon, MapPinIcon } from 'lucide-react';

interface AiSuggestionsDisplayProps {
  suggestions: SuggestLocationsOutput | null;
}

export function AiSuggestionsDisplay({ suggestions }: AiSuggestionsDisplayProps) {
  if (!suggestions) {
    return null;
  }

  const formatList = (text: string) => {
    return text.split('\n').map(item => item.trim().replace(/^- /, '')).filter(Boolean);
  };

  const suggestedHotels = formatList(suggestions.nearbyHotels);
  const suggestedLocations = formatList(suggestions.interestingLocations);

  return (
    <div className="mt-8 w-full max-w-2xl space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <HotelIcon className="mr-2 h-5 w-5 text-primary" /> Suggested Hotels
          </CardTitle>
        </CardHeader>
        <CardContent>
          {suggestedHotels.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {suggestedHotels.map((hotel, index) => (
                <li key={`hotel-${index}`}>{hotel}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No specific hotel suggestions at this time.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <MapPinIcon className="mr-2 h-5 w-5 text-primary" /> Interesting Locations to Visit
          </CardTitle>
        </CardHeader>
        <CardContent>
          {suggestedLocations.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {suggestedLocations.map((location, index) => (
                <li key={`location-${index}`}>{location}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No specific location suggestions at this time.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
