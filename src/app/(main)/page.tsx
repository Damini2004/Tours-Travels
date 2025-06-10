import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlightSearchForm } from "@/components/forms/flight-search-form";
import { HotelSearchForm } from "@/components/forms/hotel-search-form";
import { PlaneIcon, HotelIcon } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-primary">Horizon Stays</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your journey begins here. Discover amazing flights and comfortable hotels for your next getaway.
        </p>
      </section>

      <section className="mb-12">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
           <Image 
            src="https://placehold.co/1200x400.png" 
            alt="Beautiful travel destination" 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="travel landscape"
            priority
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h2 className="font-headline text-3xl md:text-4xl text-white font-semibold text-center p-4">
              Explore. Dream. Discover.
            </h2>
          </div>
        </div>
      </section>

      <section className="flex justify-center">
        <Tabs defaultValue="flights" className="w-full max-w-2xl">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="flights" className="py-3 text-base">
              <PlaneIcon className="mr-2 h-5 w-5" /> Flights
            </TabsTrigger>
            <TabsTrigger value="hotels" className="py-3 text-base">
              <HotelIcon className="mr-2 h-5 w-5" /> Hotels
            </TabsTrigger>
          </TabsList>
          <TabsContent value="flights">
            <FlightSearchForm />
          </TabsContent>
          <TabsContent value="hotels">
            <HotelSearchForm />
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Optional: Featured Destinations Section */}
      <section className="mt-16 py-8">
        <h2 className="font-headline text-3xl font-semibold text-center mb-8">Featured Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Paris', 'Kyoto', 'Rome'].map(dest => (
            <div key={dest} className="bg-card p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <Image 
                src={`https://placehold.co/400x300.png`} 
                alt={dest} 
                width={400} 
                height={300} 
                className="w-full h-48 object-cover rounded-md mb-4"
                data-ai-hint={`${dest.toLowerCase()} landmark`}
              />
              <h3 className="font-headline text-xl font-medium mb-2">{dest}</h3>
              <p className="text-sm text-muted-foreground">Discover the charm of {dest}.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
