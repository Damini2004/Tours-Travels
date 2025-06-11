
"use client";

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { placeholderHotels } from '@/lib/placeholder-data';
import type { Hotel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HotelIcon as HotelBuildingIcon, MapPinIcon, StarIcon, CheckCircleIcon, XCircleIcon, BedDoubleIcon, CalendarDaysIcon, HeartIcon } from 'lucide-react';
import { useSavedItems } from '@/hooks/use-saved-items';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function HotelDetailPage() {
  const params = useParams();
  const hotelId = params.hotelId as string;
  const { addHotelToSaved, removeHotelFromSaved, isHotelSaved, isLoading } = useSavedItems();
  const { toast } = useToast();
  
  // In a real app, fetch hotel by ID
  const hotel = placeholderHotels.find((h) => h.id === hotelId);

  const handleToggleSave = () => {
    if (!hotel) return;
    if (isHotelSaved(hotel.id)) {
      removeHotelFromSaved(hotel.id);
      toast({
        title: "Hotel Unsaved",
        description: `${hotel.name} removed from your saved items.`,
      });
    } else {
      addHotelToSaved(hotel);
      toast({
        title: "Hotel Saved!",
        description: `${hotel.name} added to your saved items.`,
      });
    }
  };

  if (isLoading && !hotel) {
     return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <XCircleIcon className="h-4 w-4" />
          <AlertTitle>Hotel Not Found</AlertTitle>
          <AlertDescription>The hotel you are looking for does not exist or has been removed.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="font-headline text-3xl md:text-4xl font-bold">{hotel.name}</h1>
                <p className="text-lg text-muted-foreground flex items-center">
                    <MapPinIcon className="mr-2 h-5 w-5" /> {hotel.location}
                </p>
            </div>
            <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`h-6 w-6 ${i < hotel.rating ? 'text-accent fill-accent' : 'text-muted-foreground/50'}`} />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">({hotel.rating}.0)</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {hotel.images && hotel.images.length > 0 && (
            <Card className="overflow-hidden">
              <div className="relative w-full h-96">
                <Image 
                  src={hotel.images[0]} 
                  alt={`${hotel.name} primary image`} 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-t-lg" 
                  data-ai-hint="hotel interior" 
                />
              </div>
              {/* Could add a small gallery preview here */}
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">About this hotel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{hotel.description || "No description available."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              {hotel.amenities && hotel.amenities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                  {hotel.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center">
                        <CheckCircleIcon className="mr-2 h-4 w-4 text-primary shrink-0" />
                        <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No amenities listed for this hotel.</p>
              )}
            </CardContent>
          </Card>
          
          {hotel.roomTypes && hotel.roomTypes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center"><BedDoubleIcon className="mr-2 h-6 w-6 text-primary" /> Room Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hotel.roomTypes.map((room, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{room.name}</h4>
                    <p className="font-semibold text-primary">${room.price.toFixed(2)}</p>
                  </div>
                  <ul className="list-disc list-inside text-xs text-muted-foreground pl-2">
                    {room.features.map(feature => <li key={feature}>{feature}</li>)}
                  </ul>
                  {index < (hotel.roomTypes?.length ?? 0) - 1 && <Separator className="my-3"/>}
                </div>
              ))}
            </CardContent>
          </Card>
          )}

        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Book Your Stay</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary mb-1">${hotel.pricePerNight.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ night</span></p>
              <p className="text-xs text-muted-foreground mb-4">(Price for standard room, may vary)</p>
              <div className="space-y-2 mb-4">
                  <p className="text-sm flex items-center"><CalendarDaysIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Check-in: {hotel.checkInTime || 'N/A'}</p>
                  <p className="text-sm flex items-center"><CalendarDaysIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Check-out: {hotel.checkOutTime || 'N/A'}</p>
              </div>
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Check Availability</Button>
               <Button 
                variant="outline" 
                size="lg" 
                className="w-full mt-2"
                onClick={handleToggleSave}
              >
                <HeartIcon className={`mr-2 h-5 w-5 ${isHotelSaved(hotel.id) ? 'fill-accent text-accent' : ''}`} />
                {isHotelSaved(hotel.id) ? 'Saved' : 'Save Hotel'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
