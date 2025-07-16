
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { MapPinIcon, HeartIcon, StarIcon, HotelIcon as HotelBuildingIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const offers = [
  {
    id: 1,
    title: "Maldives All-Inclusive Overwater Villas with A La Carte Dining, Free-Flow Drinks & Roundtrip Transfers",
    location: "Gaafu Alifu Atoll, Maldives",
    hotel: "Pullman Maldives Maamutaa",
    nights: 5,
    price: "₹3,28,499",
    originalPrice: "₹6,85,564",
    discount: "52%",
    rating: 9.4,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoSXz85WC1WVaqgaGG2e2JXHAVaQ0ifCWA4Q&s",
    tag: "Booked 30 times in 3 days",
    imageHint: "maldives overwater villa"
  },
  {
    id: 2,
    title: "Secluded Mauritius Beachfront Suites with Daily Breakfast & Nightly Dinner",
    location: "Bel Ombre, Mauritius",
    hotel: "SO Sofitel Mauritius",
    nights: 5,
    price: "₹1,05,999",
    originalPrice: "₹3,01,134",
    discount: "64%",
    rating: 8.8,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoSXz85WC1WVaqgaGG2e2JXHAVaQ0ifCWA4Q&s",
    imageHint: "mauritius beachfront suite"
  },
  {
    id: 3,
    title: "Newly Renovated Singapore Glamour near Chinatown with Club Lounge Access & Nightly Free-Flow Cocktails",
    location: "Singapore, Singapore",
    hotel: "Amara Singapore",
    nights: 3,
    price: "₹64,799",
    originalPrice: "₹1,05,500",
    discount: "38%",
    rating: 8.2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoSXz85WC1WVaqgaGG2e2JXHAVaQ0ifCWA4Q&s",
    tag: "Booked 45 times in 3 days",
    imageHint: "singapore hotel city"
  },
  {
    id: 4,
    title: "Luxury Bali Jungle Retreat with Private Pool Villas & Floating Breakfast",
    location: "Ubud, Bali, Indonesia",
    hotel: "Viceroy Bali",
    nights: 4,
    price: "₹1,85,000",
    originalPrice: "₹3,50,000",
    discount: "47%",
    rating: 9.6,
    image: "https://images.luxuryescapes.com/fl_progressive,q_auto:eco/iir8p4tz991yxf4fgnno.jpeg",
    tag: "Top Pick",
    imageHint: "bali jungle villa"
  },
  {
    id: 5,
    title: "Iconic Dubai Desert Oasis with Camel Rides & Stargazing Dinners",
    location: "Dubai Desert Conservation Reserve, UAE",
    hotel: "Al Maha, a Luxury Collection Desert Resort & Spa",
    nights: 2,
    price: "₹2,10,000",
    originalPrice: "₹3,00,000",
    discount: "30%",
    rating: 9.2,
    image: "https://images.luxuryescapes.com/fl_progressive,q_auto:eco/q8p992j0wc29l3j5t63z.jpeg",
    imageHint: "dubai desert resort"
  },
  {
    id: 6,
    title: "Chic Parisian Getaway near Eiffel Tower with Daily Champagne Breakfast",
    location: "Paris, France",
    hotel: "Le Bristol Paris",
    nights: 3,
    price: "₹2,50,000",
    originalPrice: "₹4,00,000",
    discount: "37%",
    rating: 9.0,
    image: "https://images.luxuryescapes.com/fl_progressive,q_auto:eco/k947jhm1q3b7wsqi4qam.jpeg",
    tag: "Highly Rated",
    imageHint: "paris hotel eiffel"
  },
   {
    id: 7,
    title: "Luxury Santorini Cave Hotel with Caldera Views & Private Plunge Pools",
    location: "Oia, Santorini, Greece",
    hotel: "Canaves Oia Suites",
    nights: 3,
    price: "₹2,75,000",
    originalPrice: "₹4,50,000",
    discount: "39%",
    rating: 9.8,
    image: "https://images.luxuryescapes.com/fl_progressive,q_auto:eco/uwq5h0527z0q9z6x8x6q.jpeg",
    tag: "Editor's Choice",
    imageHint: "santorini cave hotel"
  },
  {
    id: 8,
    title: "Adventure Lodge in Costa Rican Rainforest with Volcano Views & Hot Springs",
    location: "La Fortuna, Costa Rica",
    hotel: "Nayara Tented Camp",
    nights: 4,
    price: "₹1,90,000",
    originalPrice: "₹2,80,000",
    discount: "32%",
    rating: 9.5,
    image: "https://images.luxuryescapes.com/fl_progressive,q_auto:eco/v3j6s8g6j2n0u4w2y1k0.jpeg",
    imageHint: "costa rica rainforest lodge"
  },
  {
    id: 9,
    title: "Serene Kyoto Ryokan Experience with Kaiseki Dinner & Onsen Access",
    location: "Kyoto, Japan",
    hotel: "Tawaraya Ryokan",
    nights: 2,
    price: "₹2,20,000",
    originalPrice: "₹3,20,000",
    discount: "31%",
    rating: 9.3,
    image: "https://images.luxuryescapes.com/fl_progressive,q_auto:eco/y4u2o7c3w1j0x8s5z9v1.jpeg",
    tag: "Authentic",
    imageHint: "kyoto ryokan"
  }
];

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";
const defaultHotelImage = 'https://media.istockphoto.com/id/1197480605/photo/3d-render-of-luxury-hotel-lobby-and-reception.jpg?s=612x612&w=0&k=20&c=h2DMumrFFZDGqPypcK4Whx8mM1EdCKWh8PLY2saLIzo=';
const defaultHotelHint = 'hotel lobby';

const getRatingLabel = (rating: number): string => {
  if (rating >= 4.5) return "Exceptional";
  if (rating >= 4.0) return "Excellent";
  if (rating >= 3.5) return "Very Good";
  if (rating >= 3.0) return "Good";
  if (rating > 0) return "Okay";
  return "Not Rated";
};


const ExclusiveOffers = () => {
  const [savedOffers, setSavedOffers] = useState<Record<number, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleSaveOffer = (offerId: number) => {
    setSavedOffers(prev => ({ ...prev, [offerId]: !prev[offerId] }));
  };
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-background text-foreground font-sans px-2.5 md:px-[50px] pt-[30px] pb-12 md:pb-16 min-h-[auto] box-border">
      <div className="header flex flex-col md:flex-row justify-between items-start md:items-center mb-5 md:mb-8 md:mx-0 lg:mx-[50px]">
        <h2 className="text-2xl md:text-3xl lg:text-[45px] text-gray-900 font-semibold">
          Today's top <em className={`${gradientTextClass} not-italic`}>exclusive offers</em>
        </h2>
        <div className="filters flex flex-wrap items-center gap-1 md:gap-2 mt-3 md:mt-0">
          {["Bonus Dining & Drinks", "Family Friendly", "Sun & Beach"].map((filterName) => (
            <button
              key={filterName}
              className="mx-0.5 md:mx-2 px-2 py-1.5 md:px-3 md:py-1.5 bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white border-transparent rounded-xl text-xs md:text-sm cursor-pointer transition-opacity duration-300 hover:opacity-90"
            >
              {filterName}
            </button>
          ))}
          <button className="mx-0.5 md:mx-2 px-2 py-1.5 md:px-3 md:py-1.5 bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white border-transparent rounded-xl text-xs md:text-sm cursor-pointer transition-opacity duration-300 hover:opacity-90 font-bold view-all">
            View all
          </button>
           <div className="hidden md:flex items-center gap-2 ml-4">
            <Button variant="outline" size="icon" className="rounded-full border-gray-300 hover:bg-gray-100" onClick={() => scroll('left')}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-gray-300 hover:bg-gray-100" onClick={() => scroll('right')}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-6 mt-5 -mx-4 px-4 pb-4">
        {offers.map((offer) => {
          const ratingLabel = getRatingLabel(offer.rating);
          const isExceptional = ratingLabel === "Exceptional";
          return (
            <div
              className="w-[85vw] sm:w-[45vw] lg:w-[31%] flex-shrink-0 bg-white border border-gray-200 flex flex-col justify-between h-full rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1"
              key={offer.id}
            >
              <div className="image-wrapper relative">
                {offer.tag && (
                  <span className="tag absolute top-2.5 left-2.5 bg-accent text-accent-foreground px-2 py-0.5 text-xs rounded-full font-semibold shadow z-10">
                    ⚡ {offer.tag}
                  </span>
                )}
                <div className="relative w-full h-48">
                  <Image
                    src={offer.image || defaultHotelImage}
                    alt={offer.title} 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg filter brightness-95 group-hover:brightness-100 transition-filter duration-300 ease-in-out"
                    data-ai-hint={offer.imageHint || defaultHotelHint}
                  />
                </div>
                <button
                  onClick={() => toggleSaveOffer(offer.id)}
                  aria-label={savedOffers[offer.id] ? "Unsave offer" : "Save offer"}
                  className="save absolute top-2.5 right-2.5 text-muted-foreground bg-card/70 backdrop-blur-sm border-none rounded-full p-1.5 text-xl cursor-pointer transition-colors duration-300 hover:text-destructive z-10"
                >
                  <HeartIcon className={cn("h-5 w-5", savedOffers[offer.id] && "fill-accent text-accent")} />
                </button>
              </div>

              <div className="offer-info p-3.5 md:p-4 flex-grow flex flex-col">
                <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <MapPinIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{offer.location}</span>
                </div>
                 <p className="text-xs text-muted-foreground mb-1 truncate font-medium text-gray-700">{offer.hotel}</p>

                <h3 className="font-semibold my-1 text-sm leading-snug text-gray-800 h-[4.5em] overflow-hidden">
                  {offer.title}
                </h3>

                {offer.rating > 0 && (
                  <div className={cn(
                    "rating flex items-center gap-1.5 bg-secondary/60 px-2 py-0.5 rounded-full w-fit my-2 font-semibold text-secondary-foreground",
                    isExceptional && "bg-[#155e63]"
                  )}>
                    <span className={cn(
                        `score ${gradientTextClass} text-white font-bold px-1.5 py-0.5 rounded-md text-xs`,
                         isExceptional && "bg-white text-black"
                    )}>
                      {offer.rating.toFixed(1)}
                    </span>
                    <span className={cn("text-xs", isExceptional && "text-white")}>{ratingLabel}</span>
                  </div>
                )}

                <div className="price-info mt-auto pt-2">
                  <p className="my-1 text-xs text-gray-600">
                    {offer.nights} nights from <strong className={`text-base md:text-lg font-bold ${gradientTextClass}`}>{offer.price}</strong> <span className="text-xs text-muted-foreground">/room</span>
                  </p>
                  {offer.originalPrice && (
                    <div className="text-xxs text-muted-foreground mb-2">
                        Valued up to <s className="text-gray-400">{offer.originalPrice}</s>
                        {offer.discount && <span className="ml-1.5 text-green-600 font-semibold">-{offer.discount}</span>}
                    </div>
                   )}
                  <Button asChild className="mt-2 w-full bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white px-3 py-1.5 cursor-pointer rounded-md font-semibold text-sm transition-opacity duration-300 ease-in-out hover:opacity-90">
                    <Link href={`#`} >
                        View offer <HotelBuildingIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
