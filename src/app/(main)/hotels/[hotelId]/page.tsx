
"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Hotel, Booking } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HotelIcon as HotelBuildingIcon, MapPinIcon, StarIcon, CheckCircleIcon, XCircleIcon, BedDoubleIcon, CalendarDaysIcon, HeartIcon, Loader2, ShieldAlertIcon, ShieldCheckIcon } from 'lucide-react';
import { useSavedItems } from '@/hooks/use-saved-items';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback } from 'react';
import { getHotelById } from '@/lib/hotel-data';
import { format, addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CurrentUser {
  fullName: string;
  email: string;
  role: string;
}

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";
const BOOKINGS_DB_KEY = 'appBookingsDB';

const getRatingDescription = (rating: number): string => {
  if (rating >= 4.8) return "Exceptional";
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  if (rating >= 3.0) return "Fair";
  if (rating > 0) return "Okay";
  return "Not Rated";
};

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.hotelId as string;
  const { addHotelToSaved, removeHotelFromSaved, isHotelSaved, isLoading: isLoadingSaved } = useSavedItems();
  const { toast } = useToast();
  
  const [hotel, setHotel] = useState<Hotel | null | undefined>(undefined); 
  const [isLoadingHotel, setIsLoadingHotel] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthorizedToView, setIsAuthorizedToView] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) { console.error("Failed to parse current user", e); }
      }
    }
  }, []);

  const fetchHotelDetails = useCallback(() => {
    if (hotelId) {
      setIsLoadingHotel(true);
      const foundHotel = getHotelById(hotelId);
      setHotel(foundHotel);
      setIsLoadingHotel(false);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchHotelDetails();
  }, [fetchHotelDetails]);

  useEffect(() => {
    if (hotel === null || !hotel) { 
        setIsAuthorizedToView(false);
        return;
    }
    if (hotel.isApproved) {
        setIsAuthorizedToView(true);
    } else if (currentUser) {
        if (currentUser.role === 'super_admin' || currentUser.email === hotel.ownerEmail) {
            setIsAuthorizedToView(true);
        } else {
            setIsAuthorizedToView(false);
        }
    } else {
        setIsAuthorizedToView(false); 
    }
  }, [hotel, currentUser]);


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

  const handleBookHotel = () => {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Login Required", description: "Please log in to book a hotel." });
      router.push(`/login?redirect=/hotels/${hotelId}`);
      return;
    }
    if (!hotel) {
      toast({ variant: "destructive", title: "Error", description: "Hotel details not available." });
      return;
    }

    const numberOfNights = 2; 
    const guests = 1; 
    const checkIn = addDays(new Date(), 1); 
    const checkOut = addDays(checkIn, numberOfNights);

    const newBooking: Booking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.email,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelLocation: hotel.location,
      hotelOwnerEmail: hotel.ownerEmail,
      checkInDate: format(checkIn, 'yyyy-MM-dd'),
      checkOutDate: format(checkOut, 'yyyy-MM-dd'),
      guests: guests,
      totalPrice: hotel.pricePerNight * numberOfNights,
      bookedAt: new Date().toISOString(),
      status: 'Confirmed',
    };

    if (typeof window !== "undefined") {
      const existingBookingsString = localStorage.getItem(BOOKINGS_DB_KEY);
      let bookingsDB: Booking[] = [];
      if (existingBookingsString) {
        try {
          bookingsDB = JSON.parse(existingBookingsString);
        } catch (e) {
          console.error("Error parsing bookingsDB", e);
        }
      }
      bookingsDB.push(newBooking);
      localStorage.setItem(BOOKINGS_DB_KEY, JSON.stringify(bookingsDB));
      
      toast({
        title: "Booking Confirmed!",
        description: `Your stay at ${hotel.name} from ${newBooking.checkInDate} to ${newBooking.checkOutDate} is confirmed.`,
      });
      router.push('/my-bookings');
    }
  };

  if (isLoadingHotel || isLoadingSaved) {
     return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-1" />
        <Skeleton className="h-6 w-1/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (hotel === null) { 
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <XCircleIcon className="h-5 w-5" />
          <AlertTitle>Hotel Not Found</AlertTitle>
          <AlertDescription>The hotel you are looking for (ID: {hotelId}) does not exist or has been removed.</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!isAuthorizedToView) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <ShieldAlertIcon className="h-5 w-5" />
          <AlertTitle>Access Denied or Hotel Not Available</AlertTitle>
          <AlertDescription>
            This hotel is currently not approved for public viewing, or you do not have permission to view it.
            {!hotel?.isApproved && currentUser?.role === 'hotel_owner' && currentUser?.email === hotel?.ownerEmail && (
                <span className="block mt-2 text-sm">Your hotel '{hotel.name}' is still pending Super Admin approval.</span>
            )}
          </AlertDescription>
           <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </Alert>
      </div>
    );
  }
  
  if (!hotel) { 
      return (
        <div className="container mx-auto px-4 py-8 flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#0c4d52]" />
        </div>
      )
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">{hotel.name}</h1>
              {hotel.isApproved ? (
                  <Badge variant="outline" className="mt-2 sm:mt-0 text-sm border-green-500 text-green-600 bg-green-100 py-1.5 px-3 flex items-center gap-1.5">
                      <ShieldCheckIcon className="h-4 w-4"/> Approved
                  </Badge>
              ) : (
                   <Badge variant="outline" className="mt-2 sm:mt-0 text-sm border-yellow-500 text-yellow-600 bg-yellow-100 py-1.5 px-3 flex items-center gap-1.5">
                      <ShieldAlertIcon className="h-4 w-4"/> Pending Approval
                  </Badge>
              )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-md text-muted-foreground flex items-center">
                  <MapPinIcon className="mr-2 h-5 w-5 text-[#0c4d52]" /> {hotel.location}
              </p>
              <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`h-5 w-5 ${i < hotel.rating ? 'text-[#0c4d52] fill-[#0c4d52]' : 'text-muted-foreground/30'}`} />
                  ))}
                  <span className="ml-2 text-sm font-medium text-foreground">{hotel.rating.toFixed(1)}</span>
                  <span className="ml-1 text-sm text-muted-foreground">({getRatingDescription(hotel.rating)})</span>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div className="lg:col-span-2 space-y-6">
            {hotel.images && hotel.images.length > 0 && (
              <Card className="overflow-hidden shadow-lg bg-card">
                <div className="relative w-full aspect-[16/9]">
                  <Image 
                    src={hotel.images[0]} 
                    alt={`${hotel.name} primary image`} 
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-t-lg"
                    data-ai-hint={hotel.imageHints?.[0] || "hotel building exterior"}
                    priority 
                  />
                </div>
              </Card>
            )}

            <Card className="shadow-lg bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-headline text-2xl text-foreground flex items-center">
                  <HotelBuildingIcon className="mr-3 h-6 w-6 text-[#0c4d52]" /> About this hotel
                </CardTitle>
                <Separator className="mt-3" />
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">{hotel.description || "No description available."}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-headline text-2xl text-foreground">Amenities</CardTitle>
                 <Separator className="mt-3" />
              </CardHeader>
              <CardContent>
                {hotel.amenities && hotel.amenities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.amenities.map(amenity => (
                      <div key={amenity} className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md text-sm text-foreground/90">
                          <CheckCircleIcon className="h-5 w-5 shrink-0 text-[#0c4d52]" />
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
            <Card className="shadow-lg bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="font-headline text-2xl flex items-center text-foreground">
                  <BedDoubleIcon className="mr-3 h-6 w-6 text-[#0c4d52]" /> Room Options
                </CardTitle>
                 <Separator className="mt-3" />
              </CardHeader>
              <CardContent className="space-y-6">
                {hotel.roomTypes.map((room, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:shadow-lg hover:border-[#0c4d52]/30 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                      <h4 className="text-lg font-semibold text-foreground">{room.name}</h4>
                      <p className={`font-bold text-xl ${gradientTextClass}`}>${room.price.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground/90 mb-1 mt-3">Features:</p>
                    <ul className="space-y-1">
                      {room.features.map(feature => (
                          <li key={feature} className="flex items-center text-sm text-foreground/80">
                              <CheckCircleIcon className="mr-2 h-4 w-4 shrink-0 text-[#0c4d52]" />
                              {feature}
                          </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-xl sticky top-24 bg-card">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-foreground">Book Your Stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className={`text-4xl font-bold ${gradientTextClass}`}>${hotel.pricePerNight.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">/ night (standard room)</p>
                </div>
                
                <Separator />

                <div className="space-y-2">
                    <div className="flex items-center text-sm text-foreground/90">
                      <CalendarDaysIcon className="mr-2 h-4 w-4 text-muted-foreground" /> 
                      Check-in: <span className="font-medium ml-1">{hotel.checkInTime || 'Flexible'}</span>
                    </div>
                    <div className="flex items-center text-sm text-foreground/90">
                      <CalendarDaysIcon className="mr-2 h-4 w-4 text-muted-foreground" /> 
                      Check-out: <span className="font-medium ml-1">{hotel.checkOutTime || 'Flexible'}</span>
                    </div>
                </div>
                
                <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white hover:opacity-90 text-base py-3 shadow-md hover:shadow-lg transition-shadow" 
                    onClick={handleBookHotel}
                >
                  Book Now (Simplified)
                </Button>
                 <Button 
                  variant="outline" 
                  size="lg" 
                  className={cn(
                    "w-full text-base py-3",
                    isHotelSaved(hotel.id) ? "border-[#0c4d52] text-[#0c4d52] hover:bg-[#0c4d52]/10" : "text-foreground/70 hover:border-muted-foreground/50"
                  )}
                  onClick={handleToggleSave}
                  disabled={isLoadingSaved}
                >
                  <HeartIcon className={`mr-2 h-5 w-5 ${isHotelSaved(hotel.id) ? 'fill-[#0c4d52] text-[#0c4d52]' : 'text-foreground/70'}`} />
                  {isHotelSaved(hotel.id) ? 'Saved to Favorites' : 'Save to Favorites'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
