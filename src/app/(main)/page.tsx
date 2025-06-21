
import { HotelSearchForm } from "@/components/forms/hotel-search-form";
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      <div className="relative h-[50vh] min-h-[400px] flex flex-col items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury hotel pool"
            layout="fill"
            objectFit="cover"
            className="filter brightness-50"
            data-ai-hint="hotel pool luxury"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline drop-shadow-lg">Find Your Perfect Stay</h1>
          <p className="text-lg md:text-xl mt-2 text-gray-200 drop-shadow-md">Book from thousands of hotels and homes</p>
        </div>
      </div>
      <div className="relative z-20 -mt-24 px-4">
        <div className="max-w-5xl mx-auto">
            <HotelSearchForm />
        </div>
      </div>
       {/* Placeholder for other content sections */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">More To Explore</h2>
        <p className="text-muted-foreground">Placeholder for featured destinations or other content.</p>
      </div>
    </>
  );
}
