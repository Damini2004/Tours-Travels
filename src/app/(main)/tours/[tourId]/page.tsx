
"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Share2, Heart, PlayCircle, ImageIcon as GalleryIcon, Info, Eye, Phone, Star, VideoIcon, XCircleIcon, CalendarDays, Plane, Bed, Utensils, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { TourPackage } from '@/lib/types';
import { getTourPackageById } from '@/lib/tour-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSettings, currencySymbols } from '@/context/SettingsContext';

const defaultImage = "https://placehold.co/1200x800.png";
const defaultHint = "tour destination";

export default function TourPackagePage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.tourId as string;
  const [tour, setTour] = useState<TourPackage | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { settings } = useSettings();
  const currencySymbol = currencySymbols[settings.currency] || '₹';

  useEffect(() => {
    if (tourId) {
      const foundTour = getTourPackageById(tourId);
      setTour(foundTour);
    }
    setIsLoading(false);
  }, [tourId]);

  const calculateDiscount = (price: number, originalPrice: number) => {
    if (originalPrice <= price || originalPrice === 0) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  if (isLoading) {
    return <PackagePageSkeleton />;
  }

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
            <XCircleIcon className="h-4 w-4" />
          <AlertTitle>Tour Package Not Found</AlertTitle>
          <AlertDescription>The tour package you are looking for does not exist.</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const discount = calculateDiscount(tour.price, tour.originalPrice);
  const mainImage = tour.imageUrl || defaultImage;
  const mainImageHint = tour.imageHint || defaultHint;

  return (
    <div className="bg-white text-stone-800 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image & Header */}
        <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-6 shadow-lg">
            <Image src={mainImage} alt={tour.title} layout="fill" objectFit="cover" data-ai-hint={mainImageHint} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
                <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-white/30 backdrop-blur-sm">{tour.tourType}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{tour.title}</h1>
                 <div className="flex items-center text-sm text-white/90 mt-2">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span>{tour.location}</span>
                </div>
            </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-semibold text-lg text-gray-800 flex items-center justify-center gap-2"><CalendarDays className="w-5 h-5 text-primary"/>{tour.durationDays} Days</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Includes</p>
                        <div className="font-semibold text-lg text-gray-800 flex items-center justify-center gap-2"><Plane className="w-5 h-5 text-primary"/><Bed className="w-5 h-5 text-primary"/><Utensils className="w-5 h-5 text-primary"/></div>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="font-semibold text-lg text-gray-800 flex items-center justify-center gap-2"><Star className="w-5 h-5 text-amber-400 fill-amber-400"/>4.5/5</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Guarantee</p>
                        <p className="font-semibold text-lg text-gray-800 flex items-center justify-center gap-2"><ShieldCheck className="w-5 h-5 text-green-500"/>Best Price</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>About This Tour</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                        Embark on an unforgettable {tour.durationDays}-day journey exploring the wonders of {tour.location}. This {tour.tourType} package offers an exclusive experience, blending cultural immersion with luxurious comfort. From historic landmarks to breathtaking natural landscapes, every detail has been curated to provide you with a seamless and memorable adventure. Enjoy stays in premium hotels, delicious meals, and expert-guided excursions.
                    </p>
                </CardContent>
            </Card>

          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-24 border-gray-200">
                <CardHeader>
                    <CardTitle>Reserve Your Spot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-md">
                        <p className="text-sm text-stone-600">Per person from</p>
                        <p className="text-3xl font-bold text-stone-800">
                           {currencySymbol}{tour.price.toLocaleString('en-IN')}
                        </p>
                        <div className="text-xs text-stone-500 mt-1">
                            Valued up to <s>{currencySymbol}{tour.originalPrice.toLocaleString('en-IN')}</s>
                            {discount > 0 && <Badge variant="destructive" className="ml-2 bg-green-600 text-white">{discount}% OFF</Badge>}
                        </div>
                    </div>
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base">
                        Book Now
                    </Button>
                     <Button variant="outline" size="lg" className="w-full h-12 text-base">
                        <Heart className="mr-2 h-4 w-4" /> Save to Wishlist
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const PackagePageSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <Skeleton className="h-64 md:h-80 w-full rounded-lg bg-gray-200 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-24 w-full bg-gray-200" />
                <Skeleton className="h-8 w-40 bg-gray-200" />
                <Skeleton className="h-5 w-full bg-gray-200" />
                <Skeleton className="h-5 w-full bg-gray-200" />
                <Skeleton className="h-5 w-3/4 bg-gray-200" />
            </div>
            <div className="lg:col-span-1">
                <Skeleton className="h-64 w-full rounded-lg bg-gray-200" />
            </div>
        </div>
    </div>
);
