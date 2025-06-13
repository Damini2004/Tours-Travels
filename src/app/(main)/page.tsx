

import HeroSection from "@/components/hero/HeroSection"; // Import the new HeroSection
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AwardIcon, ClockIcon, ShieldCheckIcon, WalletIcon } from "lucide-react";
// ExclusiveOffers is now part of PlacesGallery, which is part of HeroSection for this page structure
// import { placeholderHotels } from "@/lib/placeholder-data"; // This would be used by ExclusiveOffers


export default function HomePage() {
  const featuredDestinations = [
    { name: 'Maldives', imageHint: 'maldives bungalow', description: 'Escape to pristine beaches and luxury overwater villas.' },
    { name: 'Santorini', imageHint: 'santorini greece', description: 'Iconic white-washed villages and stunning sunsets.' },
    { name: 'Dubai', imageHint: 'dubai skyline', description: 'Experience modern marvels and desert adventures.' },
  ];

  const whyBookWithUs = [
    { title: "Best Price Guarantee", description: "Find a lower price? We'll match it.", icon: AwardIcon },
    { title: "24/7 Customer Support", description: "Our team is here to help, anytime, anywhere.", icon: ClockIcon },
    { title: "Secure Booking", description: "Your data is safe with our advanced security.", icon: ShieldCheckIcon },
    { title: "Flexible Payments", description: "Choose from various payment options for your ease.", icon: WalletIcon },
  ];

  return (
    <>
      <HeroSection />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* "Today's Top Exclusive Offers" is now part of PlacesGallery, which is inside HeroSection */}
        
        <section className="my-16 py-8 bg-card rounded-lg p-8">
          <h2 className="font-headline text-3xl font-semibold text-center mb-10">Why You Should Book With Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {whyBookWithUs.map(item => (
              <div key={item.title} className="flex flex-col items-center p-4">
                <item.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-headline text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-16 py-8">
          <h2 className="font-headline text-3xl font-semibold text-center mb-10">Discover Your Ideal Escape</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map(dest => (
              <div key={dest.name} className="bg-card p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow relative overflow-hidden group">
                <Image 
                  src={`https://placehold.co/400x300.png`} 
                  alt={dest.name} 
                  width={400} 
                  height={300} 
                  className="w-full h-60 object-cover rounded-md mb-4 transform group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={dest.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="font-headline text-2xl font-semibold text-foreground mb-1">{dest.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{dest.description}</p>
                  <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background" asChild>
                      <Link href={`/hotels/search?location=${encodeURIComponent(dest.name)}`}>Explore</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
