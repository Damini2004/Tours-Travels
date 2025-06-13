
"use client";
import Image from 'next/image';

const galleryPlaces = [
    { id: 1, src: "https://placehold.co/200x150.png", alt: "Beach Destination", name: "Maldives", hint: "maldives beach" },
    { id: 2, src: "https://placehold.co/200x150.png", alt: "Mountain Destination", name: "Swiss Alps", hint: "swiss alps" },
    { id: 3, src: "https://placehold.co/200x150.png", alt: "City Destination", name: "Paris", hint: "paris city" },
    { id: 4, src: "https://placehold.co/200x150.png", alt: "Forest Destination", name: "Amazon", hint: "amazon forest" },
];

const PlacesGallery = () => {
  return (
    <div className="bg-background py-8 -mt-16 relative z-10 rounded-t-xl shadow-2xl">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-headline font-semibold text-center text-foreground mb-6">Explore Top Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryPlaces.map(place => (
            <div key={place.id} className="group relative overflow-hidden rounded-lg shadow-md">
              <Image 
                src={place.src} 
                alt={place.alt} 
                width={200} 
                height={150} 
                className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-110"
                data-ai-hint={place.hint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-3">
                <h3 className="text-foreground font-semibold text-sm">{place.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesGallery;
