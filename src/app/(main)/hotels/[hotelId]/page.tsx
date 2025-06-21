"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Hotel, Booking, Review } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HotelIcon as HotelBuildingIcon, MapPinIcon, StarIcon, CheckCircleIcon, XCircleIcon, BedDoubleIcon, CalendarDaysIcon, HeartIcon, Loader2, ShieldAlertIcon, ShieldCheckIcon, UsersIcon, ParkingCircleIcon, WifiIcon, UtensilsIcon, DumbbellIcon } from 'lucide-react';
import { useSavedItems } from '@/hooks/use-saved-items';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback } from 'react';
import { getHotelById, getHotels } from '@/lib/hotel-data';
import { format, addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HotelCard } from '@/components/cards/hotel-card';

interface CurrentUser {
  fullName: string;
  email: string;
  role: string;
}

const BOOKINGS_DB_KEY = 'appBookingsDB';
const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

const getRatingDescription = (rating: number): string => {
  if (rating >= 4.8) return "Exceptional";
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  if (rating >= 3.0) return "Fair";
  if (rating > 0) return "Okay";
  return "Not Rated";
};

// Helper to get an icon for an amenity - extend as needed
const getAmenityIcon = (amenityName: string): React.ElementType => {
  const lowerAmenity = amenityName.toLowerCase();
  if (lowerAmenity.includes('wi-fi') || lowerAmenity.includes('wifi')) return WifiIcon;
  if (lowerAmenity.includes('pool')) return DumbbellIcon; // Placeholder, actual pool icon would be better
  if (lowerAmenity.includes('gym')) return DumbbellIcon;
  if (lowerAmenity.includes('restaurant')) return UtensilsIcon;
  if (lowerAmenity.includes('parking')) return ParkingCircleIcon;
  if (lowerAmenity.includes('spa')) return StarIcon; // Placeholder
  return CheckCircleIcon; // Default
}

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.hotelId as string;
  const { addHotelToSaved, removeHotelFromSaved, isHotelSaved, isLoading: isLoadingSaved } = useSavedItems();
  const { toast } = useToast();
  
  const [hotel, setHotel] = useState<Hotel | null | undefined>(undefined); 
  const [similarHotels, setSimilarHotels] = useState<Hotel[]>([]);
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
      if (foundHotel) {
        const allDbHotels = getHotels();
        setSimilarHotels(allDbHotels.filter(h => h.id !== hotelId).slice(0, 4));
      }
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

  const handleToggleSave = (hotelToToggle: Hotel) => {
    if (isHotelSaved(hotelToToggle.id)) {
      removeHotelFromSaved(hotelToToggle.id);
      toast({
        title: "Hotel Unsaved",
        description: `${hotelToToggle.name} removed from your saved items.`,
      });
    } else {
      addHotelToSaved(hotelToToggle);
      toast({
        title: "Hotel Saved!",
        description: `${hotelToToggle.name} added to your saved items.`,
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
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
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
  
  const mainImage = hotel.images && hotel.images.length > 0 ? hotel.images[0] : 'https://placehold.co/1200x800.png';
  const mainImageHint = hotel.imageHints && hotel.imageHints.length > 0 ? hotel.imageHints[0] : 'hotel building';
  const secondaryImage1 = hotel.images && hotel.images.length > 1 ? hotel.images[1] : 'https://placehold.co/600x400.png';
  const secondaryImage1Hint = hotel.imageHints && hotel.imageHints.length > 1 ? hotel.imageHints[1] : 'hotel room';
  const secondaryImage2 = hotel.images && hotel.images.length > 2 ? hotel.images[2] : 'https://placehold.co/600x400.png';
  const secondaryImage2Hint = hotel.imageHints && hotel.imageHints.length > 2 ? hotel.imageHints[2] : 'hotel amenities';


  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header Section: Name, Location, Rating */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">{hotel.name}</h1>
            {hotel.isApproved ? (
                <Badge variant="outline" className="mt-2 sm:mt-0 text-sm border-green-500 text-green-600 bg-green-100 py-1 px-2.5 flex items-center gap-1.5">
                    <ShieldCheckIcon className="h-4 w-4"/> Approved
                </Badge>
            ) : (
                 <Badge variant="outline" className="mt-2 sm:mt-0 text-sm border-yellow-500 text-yellow-600 bg-yellow-100 py-1 px-2.5 flex items-center gap-1.5">
                    <ShieldAlertIcon className="h-4 w-4"/> Pending Approval
                </Badge>
            )}
          </div>
          <div className="flex items-center mt-1 text-muted-foreground">
            <MapPinIcon className="mr-1.5 h-4 w-4 text-[#0c4d52]" />
            <span>{hotel.location}</span>
            <span className="mx-2">·</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(hotel.rating) ? 'text-[#0c4d52] fill-[#0c4d52]' : 'text-gray-300'}`} />
              ))}
              <span className="ml-1.5 text-sm font-medium text-foreground">{hotel.rating.toFixed(1)}</span>
              <span className="ml-1 text-sm text-muted-foreground">({getRatingDescription(hotel.rating)})</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Image Gallery, About, Amenities, Rooms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-[300px] sm:h-auto sm:max-h-[500px]">
                <div className="relative rounded-lg overflow-hidden group w-full h-full">
                    <Image src={mainImage} alt={`${hotel.name} main view`} layout="fill" objectFit="cover" className="transform group-hover:scale-105 transition-transform duration-300" data-ai-hint={mainImageHint} />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">+{hotel.images?.length || 1} Property Photos</div>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:gap-2 w-full h-full">
                    <div className="relative h-1/2 w-full rounded-lg overflow-hidden group">
                        <Image src={secondaryImage1} alt={`${hotel.name} view 2`} layout="fill" objectFit="cover" className="transform group-hover:scale-105 transition-transform duration-300" data-ai-hint={secondaryImage1Hint} />
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Room Photos</div>
                    </div>
                    <div className="relative h-1/2 w-full rounded-lg overflow-hidden group">
                        <Image src={secondaryImage2} alt={`${hotel.name} view 3`} layout="fill" objectFit="cover" className="transform group-hover:scale-105 transition-transform duration-300" data-ai-hint={secondaryImage2Hint} />
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">+ Guest Photos</div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-foreground">About {hotel.name}</CardTitle>
                <Separator className="mt-2"/>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">{hotel.description || "No description available."}</p>
              </CardContent>
            </Card>

            {/* Amenities Section */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-foreground">Amenities</CardTitle>
                  <Separator className="mt-2"/>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {hotel.amenities.map(amenity => {
                      const IconComponent = getAmenityIcon(amenity);
                      return (
                        <div key={amenity} className="flex items-center gap-2 p-2.5 bg-slate-100 dark:bg-slate-800/50 rounded-md text-sm text-foreground/90">
                            <IconComponent className="h-5 w-5 shrink-0 text-[#0c4d52]" />
                            <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Room Options Section */}
            {hotel.roomTypes && hotel.roomTypes.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center text-foreground">
                  <BedDoubleIcon className="mr-2 h-6 w-6 text-[#0c4d52]" /> Room Options
                </CardTitle>
                 <Separator className="mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {hotel.roomTypes.map((room, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:shadow-xl hover:border-[#0c4d52]/30 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                      <h4 className="text-lg font-semibold text-foreground">{room.name}</h4>
                      <p className={`text-xl font-bold ${gradientTextClass}`}>${room.price.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground/90 mb-1 mt-3">Features:</p>
                    <ul className="list-disc list-inside space-y-1 pl-1">
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

             {/* Detailed Guest Reviews */}
            {hotel.reviews && hotel.reviews.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-foreground">Guest Reviews</CardTitle>
                <Separator className="mt-2"/>
              </CardHeader>
              <CardContent className="space-y-6">
                {hotel.reviews.map((review, index) => (
                  <div key={index} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={review.reviewerAvatarUrl} alt={review.reviewerName} data-ai-hint={review.reviewerAvatarHint} />
                      <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm text-foreground">{review.reviewerName}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(review.date), 'MMMM d, yyyy')}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-[#0c4d52] fill-[#0c4d52]' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 mt-2">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            )}

            {/* Location Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-foreground">Location</CardTitle>
                  <Separator className="mt-2"/>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-700 rounded-md overflow-hidden">
                  <Image 
                      src="https://placehold.co/600x400.png"
                      alt={`Map showing location of ${hotel.name}`}
                      layout="fill"
                      objectFit="cover"
                      className="opacity-50"
                      data-ai-hint="city map"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="secondary" asChild>
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.location)}`} target="_blank" rel="noopener noreferrer">
                              View on Google Maps
                          </a>
                      </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground/90 mt-3 font-semibold">{hotel.name}</p>
                <p className="text-xs text-muted-foreground">{hotel.location}</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-xl sticky top-24 bg-card border border-border">
              <CardHeader>
                <CardTitle className="font-headline text-lg text-foreground">Book Your Stay</CardTitle> 
                <CardDescription>Select a room to see final price.</CardDescription>
                 <Separator className="mt-2"/>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="pt-2">
                    <p className='text-xs text-muted-foreground'>Starting from</p>
                    <s className="text-sm text-muted-foreground">$ {(hotel.pricePerNight * 1.25).toFixed(2)}</s>
                    <p className={`text-3xl font-bold ${gradientTextClass}`}>${hotel.pricePerNight.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">per night + taxes & fees</p>
                </div>
                
                <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white hover:opacity-90 text-base py-3 shadow-md hover:shadow-lg transition-shadow" 
                    onClick={handleBookHotel}
                >
                  Book This Now
                </Button>
                 <Button 
                  variant="outline" 
                  size="lg" 
                  className={cn(
                    "w-full text-base py-3 border-input",
                    isHotelSaved(hotel.id) ? "border-[#0c4d52] text-[#0c4d52] hover:bg-[#0c4d52]/10" : "text-foreground/70 hover:border-muted-foreground/50"
                  )}
                  onClick={() => handleToggleSave(hotel)}
                  disabled={isLoadingSaved}
                >
                  <HeartIcon className={`mr-2 h-5 w-5 ${isHotelSaved(hotel.id) ? 'fill-[#0c4d52] text-[#0c4d52]' : 'text-foreground/70'}`} />
                  {isHotelSaved(hotel.id) ? 'Saved' : 'Save this hotel'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarHotels.length > 0 && (
          <>
            <Separator className="my-12" />
            <div className="space-y-6">
              <h2 className="font-headline text-2xl font-bold text-foreground">You might also like</h2>
              <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 -mx-4 px-4 scrollbar-hide">
                {similarHotels.map(similarHotel => (
                  <HotelCard 
                    key={similarHotel.id} 
                    hotel={similarHotel} 
                    isSaved={isHotelSaved(similarHotel.id)} 
                    onToggleSave={() => handleToggleSave(similarHotel)} 
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}