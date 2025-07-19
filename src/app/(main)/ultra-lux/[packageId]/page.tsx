
"use client";

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Share2, Heart, PlayCircle, ImageIcon as GalleryIcon, Info, Eye, Phone, Star, VideoIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UltraLuxPackage } from '@/lib/types';
import { getUltraLuxPackages } from '@/lib/hotel-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const defaultImage = "https://placehold.co/1200x800.png";
const defaultHint = "luxury resort";

export default function UltraLuxPackagePage() {
  const params = useParams();
  const packageId = params.packageId as string;
  const [pkg, setPackage] = useState<UltraLuxPackage | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (packageId) {
      const allPackages = getUltraLuxPackages();
      const foundPackage = allPackages.find(p => p.id === packageId);
      setPackage(foundPackage);
    }
    setIsLoading(false);
  }, [packageId]);

  const calculateDiscount = (price: number, originalPrice: number) => {
    if (originalPrice <= price || originalPrice === 0) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  if (isLoading) {
    return <PackagePageSkeleton />;
  }

  if (!pkg) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Package Not Found</AlertTitle>
          <AlertDescription>The luxury package you are looking for does not exist.</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const discount = calculateDiscount(pkg.price, pkg.originalPrice);
  const mainImage = (pkg.imageUrls && pkg.imageUrls[0]) || defaultImage;
  const mainImageHint = (pkg.imageHints && pkg.imageHints[0]) || defaultHint;
  const secondaryImage = (pkg.imageUrls && pkg.imageUrls[1]) || "https://placehold.co/600x400/a7a29a/ffffff.png";
  const secondaryImageHint = (pkg.imageHints && pkg.imageHints[1]) || "resort pool";


  return (
    <div className="bg-white text-stone-800 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-[300px] md:h-[500px] mb-6">
          <div className="relative h-full w-full rounded-lg overflow-hidden group">
            <Image src={mainImage} alt={pkg.title} layout="fill" objectFit="cover" data-ai-hint={mainImageHint} />
            <div className="absolute top-4 left-4 z-10">
                <Badge variant="default" className="bg-black/60 text-white border-none rounded-md text-sm tracking-widest py-1.5 px-3 shadow-lg">
                    ULTRA<span className='font-bold'>LUX</span>
                </Badge>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-2 h-full w-full">
            <div className="relative h-1/2 w-full rounded-lg overflow-hidden group">
               <Image src={secondaryImage} alt={`${pkg.title} view 2`} layout="fill" objectFit="cover" data-ai-hint={secondaryImageHint} />
            </div>
            <div className="relative h-1/2 w-full rounded-lg overflow-hidden group bg-stone-900 flex items-center justify-center">
               {pkg.videoUrl ? (
                 <video src={pkg.videoUrl} className="w-full h-full object-cover" controls autoPlay muted loop playsInline>
                    Your browser does not support the video tag.
                 </video>
               ) : (
                 <div className="text-white/50 flex flex-col items-center">
                    <VideoIcon className="h-10 w-10 mb-2"/>
                    <p className="text-sm">Video not available</p>
                 </div>
               )}
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-white text-stone-800">
                        <GalleryIcon className="mr-2 h-4 w-4"/> View gallery
                    </Button>
               </div>
            </div>
          </div>
        </div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <div className="flex items-center text-sm text-stone-600 mb-1">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>{pkg.location}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-stone-800">{pkg.brand}</h1>
            <p className="text-stone-600 mt-1 max-w-xl">{pkg.title}</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button variant="ghost" size="sm" className="text-stone-600 hover:text-stone-800"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
            <Button variant="ghost" size="sm" className="text-stone-600 hover:text-stone-800"><Heart className="mr-2 h-4 w-4" /> Save</Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-6">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-stone-800 mb-2">About {pkg.brand}</h2>
                <p className="text-stone-600 leading-relaxed">
                  The southwest coast of Bali is home to the five-star Soori Bali, an oceanfront and sustainably driven resort designed by award-winning architecture firm SCDA. Favoured by celebrities, this opulent retreat is dedicated to providing an A-list experience. The two restaurants use fresh produce from nearby farms and spices from their own garden to craft exquisite meals. If you're craving premium Western cuisine, secure a table at Ombak, while the open-air Cotta serves authentic Indonesian cuisine. The palm-fringed infinity pool blends into the horizon, offering a pleasant space to forget the world, while Soori Spa and its menu of pampering treatments offer a transcendental experience.
                </p>
              </div>
              <div className="hidden sm:block">
                  <Image src="/logos/soori-bali-logo.png" alt={`${pkg.brand} logo`} width={120} height={48} className="shrink-0" data-ai-hint="hotel brand logo"/>
              </div>
            </div>

            <Card className="bg-gray-50 border-gray-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                    <Image src="https://placehold.co/80x80/a7a29a/ffffff.png" alt="Concierge" width={64} height={64} className="rounded-full h-16 w-16" data-ai-hint="concierge smiling"/>
                    <div>
                        <h4 className="font-semibold text-stone-800">Premium concierge service</h4>
                        <p className="text-sm text-stone-600">Our team are available anytime, 9am to 7pm, 7 days a week.</p>
                        <a href="tel:+918037835334" className="text-sm font-semibold text-stone-700 hover:text-stone-900 mt-1 flex items-center gap-1.5"><Phone className="h-4 w-4" />+91 803 783 5334</a>
                    </div>
                </CardContent>
            </Card>

          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-24 border-gray-200">
                <CardContent className="p-4 space-y-3">
                    <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-md text-center text-sm text-purple-800 font-medium">
                        <Eye className="inline h-4 w-4 mr-1.5" /> Viewed 125 times in 3 days
                    </div>
                    <div className="p-4 border border-gray-200 rounded-md">
                        <p className="text-sm text-stone-600">{pkg.nights} nights from</p>
                        <p className="text-3xl font-bold text-stone-800">₹{pkg.price.toLocaleString('en-IN')}<span className="text-sm font-normal text-stone-500"> /villa</span></p>
                        <p className="text-xs text-stone-500 flex items-center gap-1">Includes taxes & fees <Info className="h-3 w-3"/></p>
                        <div className="text-xs text-stone-500 mt-2">
                            Valued up to <s>₹{pkg.originalPrice.toLocaleString('en-IN')}</s>
                            {discount > 0 && <Badge className="ml-2 bg-green-100 text-green-700 border-green-200">{discount}%</Badge>}
                        </div>
                    </div>
                    <p className="text-xs text-stone-600 px-1">Add flights to the hotel package. Select from all major airlines at the next step.</p>
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base">
                        View package options
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-[300px] md:h-[500px] mb-6">
            <Skeleton className="h-full w-full rounded-lg bg-gray-200" />
            <div className="hidden lg:flex flex-col gap-2 h-full w-full">
                <Skeleton className="h-1/2 w-full rounded-lg bg-gray-200" />
                <Skeleton className="h-1/2 w-full rounded-lg bg-gray-200" />
            </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
                <Skeleton className="h-6 w-48 mb-2 bg-gray-200" />
                <Skeleton className="h-10 w-80 mb-2 bg-gray-200" />
                <Skeleton className="h-5 w-96 bg-gray-200" />
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
                <Skeleton className="h-8 w-24 bg-gray-200" />
                <Skeleton className="h-8 w-24 bg-gray-200" />
            </div>
        </div>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
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
