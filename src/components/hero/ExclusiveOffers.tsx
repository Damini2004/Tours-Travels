
"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { placeholderHotels } from '@/lib/placeholder-data'; // Assuming this path is correct

export default function ExclusiveOffers() {
  return (
    <section className="my-16 py-8">
      <h2 className="font-headline text-3xl font-semibold text-center mb-10 text-foreground">
        Today&apos;s Top Exclusive Offers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {placeholderHotels.slice(0,3).map(hotel => (
          <Card key={hotel.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
            {hotel.thumbnailUrl && (
              <div className="relative w-full h-56">
                <Image 
                  src={hotel.thumbnailUrl} 
                  alt={hotel.name} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={hotel.thumbnailHint || "hotel exterior"}
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="font-headline text-xl text-card-foreground">{hotel.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{hotel.location}</p>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-primary">${hotel.pricePerNight.toFixed(2)} <span className="text-xs text-muted-foreground">/ night</span></p>
              <Button asChild className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={`/hotels/${hotel.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
