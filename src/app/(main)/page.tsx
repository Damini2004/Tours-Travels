
import HeroSection from "@/components/hero/HeroSection";
import { HotelSearchForm } from "@/components/forms/hotel-search-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { HotelIcon } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center">
              <HotelIcon className="mr-3 h-8 w-8 text-primary" />
              Find Your Perfect Stay
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Search for hotels, resorts, and more for your next adventure.
            </p>
          </div>
          <div className="flex justify-center">
            <HotelSearchForm />
          </div>
        </div>
      </section>
      
      <Separator className="my-8 md:my-12" />

      {/* Placeholder for other content sections if needed later */}
      {/* 
        Example:
        <section className="py-12 md:py-16 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4">Explore Destinations</h2>
            <p className="text-muted-foreground mb-8">Discover amazing places around the world.</p>
            <Button asChild size="lg">
              <Link href="/inspiration">Get Inspired</Link>
            </Button>
          </div>
        </section> 
      */}
    </>
  );
}
