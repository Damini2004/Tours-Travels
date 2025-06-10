
import { HotelSearchForm } from "@/components/forms/hotel-search-form";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AwardIcon, ClockIcon, ShieldCheckIcon, WalletIcon } from "lucide-react";


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
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center mb-12 relative min-h-[65vh] md:min-h-[75vh] flex flex-col items-center rounded-lg overflow-hidden pt-16 md:pt-24">
        <Image 
          src="https://placehold.co/1600x900.png" 
          alt="Tropical beach paradise" 
          layout="fill" 
          objectFit="cover"
          data-ai-hint="tropical beach ocean"
          priority
          className="z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 w-full px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Hotels & Resorts to dream about
          </h1>
          <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto mb-10">
            Find your next stay for your dream vacation. Unforgettable experiences await.
          </p>
          <div className="w-full max-w-3xl mx-auto">
             <HotelSearchForm />
          </div>
        </div>
      </section>

      <section className="my-16 py-8">
        <h2 className="font-headline text-3xl font-semibold text-center mb-10">
          Today's Top Exclusive Offers
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
                    data-ai-hint="hotel exterior"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline text-xl">{hotel.name}</CardTitle>
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
  );
}

// Minimal placeholder data for hotels if not already available or for quick display
const placeholderHotels = [
  { id: 'HT001', name: 'Luxury Beach Resort', location: 'Cancun, Mexico', pricePerNight: 350, thumbnailUrl: 'https://placehold.co/400x300.png?text=Beach+Resort' },
  { id: 'HT002', name: 'City Center Boutique', location: 'Paris, France', pricePerNight: 220, thumbnailUrl: 'https://placehold.co/400x300.png?text=City+Hotel' },
  { id: 'HT003', name: 'Mountain View Lodge', location: 'Aspen, USA', pricePerNight: 450, thumbnailUrl: 'https://placehold.co/400x300.png?text=Mountain+Lodge' },
];
