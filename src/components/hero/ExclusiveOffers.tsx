
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPinIcon, HeartIcon } from "lucide-react"; // Added icons
import { cn } from "@/lib/utils"; // For conditional classes

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
    ratingLabel: "Exceptional",
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
    ratingLabel: "Excellent",
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
    ratingLabel: "Very Good",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoSXz85WC1WVaqgaGG2e2JXHAVaQ0ifCWA4Q&s",
    tag: "Booked 45 times in 3 days",
    imageHint: "singapore hotel city"
  },
];

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

const ExclusiveOffers = () => {
  const [activeTab, setActiveTab] = useState("Hotels");
  const [savedOffers, setSavedOffers] = useState<Record<number, boolean>>({});

  const toggleSaveOffer = (offerId: number) => {
    setSavedOffers(prev => ({ ...prev, [offerId]: !prev[offerId] }));
  };

  return (
    <div className="bg-background text-foreground font-sans px-2.5 md:px-[50px] pt-[30px] pb-12 md:pb-16 min-h-[auto] box-border">
      <div className="header flex flex-col md:flex-row justify-between items-start md:items-center mb-5 md:mb-8 md:mx-0 lg:mx-[50px]">
        <h2 className="text-2xl md:text-3xl lg:text-[45px] text-gray-900 font-semibold">
          Today's top <em className={`${gradientTextClass} not-italic`}>exclusive offers</em>
        </h2>
        <div className="filters flex flex-wrap gap-1 md:gap-2 mt-3 md:mt-0">
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
        </div>
      </div>

      <div className="offer-list flex overflow-x-auto gap-4 md:gap-6 mt-5 scrollbar-hide pb-4">
        {offers.map((offer) => (
          <div 
            className="offer-card bg-card border border-border w-full max-w-[320px] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-[550px] flex-shrink-0 flex flex-col justify-between h-full rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1" 
            key={offer.id}
          >
            <div className="image-wrapper relative">
              {offer.tag && (
                <span className="tag absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 text-xs rounded-full font-semibold shadow z-10">
                  ⚡ {offer.tag}
                </span>
              )}
              <div className="relative w-full h-48"> {/* Consistent image height */}
                <Image 
                  src={offer.image} 
                  alt={offer.title} 
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg filter brightness-90 group-hover:brightness-100 transition-all duration-300 ease-in-out"
                  data-ai-hint={offer.imageHint}
                />
              </div>
              <button 
                onClick={() => toggleSaveOffer(offer.id)}
                aria-label={savedOffers[offer.id] ? "Unsave offer" : "Save offer"}
                className="save absolute top-3 right-3 text-card-foreground bg-card/70 backdrop-blur-sm rounded-full p-1.5 cursor-pointer transition-colors duration-300 hover:text-destructive z-10"
              >
                <HeartIcon className={cn("h-5 w-5", savedOffers[offer.id] && "fill-accent text-accent")} />
              </button>
            </div>

            <div className="offer-info p-4 flex-grow flex flex-col">
              <div className="text-xs text-muted-foreground mb-1 flex items-center">
                  <MapPinIcon className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/80" /> 
                  <span className="truncate">{offer.location}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{offer.hotel}</p>
              
              <h3 className="font-semibold text-base md:text-base leading-snug text-foreground mb-3 h-[3.2em] overflow-hidden"> {/* Adjusted title height and margin */}
                {offer.title}
              </h3>

              {offer.rating > 0 && (
                <div className="rating flex items-center gap-2 bg-secondary/60 px-2.5 py-1 rounded-full w-fit my-2 font-medium text-secondary-foreground">
                  <span className={`score ${gradientTextClass} font-bold px-1.5 py-0.5 rounded-md text-sm`}>
                    {offer.rating.toFixed(1)}
                  </span>
                  <span className="text-xs">{offer.ratingLabel}</span>
                </div>
              )}
              
              <div className="mt-auto pt-3"> {/* Price and CTA pushed to bottom */}
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground">{offer.nights} nights from </span>
                  <span className={`text-xl md:text-2xl font-bold ${gradientTextClass}`}>{offer.price}</span>
                  <span className="text-xs text-muted-foreground"> /room</span>
                </div>
                {offer.originalPrice && (
                  <div className="text-xs text-muted-foreground mb-3">
                    Valued up to <s className="text-gray-400">{offer.originalPrice}</s>
                    {offer.discount && <span className="ml-2 text-green-600 font-semibold">-{offer.discount}</span>}
                  </div>
                )}
                <button className="view-offer mt-2 w-full bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white px-4 py-2.5 cursor-pointer rounded-md font-semibold text-sm md:text-base transition-opacity duration-300 ease-in-out hover:opacity-90 shadow-md hover:shadow-lg">
                  View offer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
