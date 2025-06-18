
"use client";

import React, { useState } from "react";
import Image from "next/image";

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

const ExclusiveOffers = () => {
  const [activeTab, setActiveTab] = useState("Hotels"); 

  return (
    <div className="bg-white text-gray-800 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif] px-2.5 md:px-[50px] pt-[30px] pb-12 md:pb-16 min-h-[auto] box-border">
      <div className="header flex flex-col md:flex-row justify-between items-start md:items-center mb-5 md:mb-8 md:mx-0 lg:mx-[50px]">
        <h2 className="text-2xl md:text-3xl lg:text-[45px] text-gray-900 font-semibold">
          Today's top <em>exclusive offers</em>
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
            className="offer-card bg-white border border-gray-200 w-full max-w-[320px] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-[550px] flex-shrink-0 flex flex-col justify-between h-full shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1" 
            key={offer.id}
          >
            <div className="image-wrapper relative">
              {offer.tag && (
                <span className="tag absolute top-2.5 left-2.5 bg-accent text-accent-foreground px-3 py-1 text-xs rounded-full font-semibold shadow-sm z-10">
                  ⚡ {offer.tag}
                </span>
              )}
              <div className="relative w-full h-[150px] sm:h-[160px] md:h-[180px] lg:h-[200px]">
                <Image 
                  src={offer.image} 
                  alt={offer.title} 
                  layout="fill"
                  objectFit="cover"
                  className="filter brightness-95 group-hover:brightness-100 transition-filter duration-300 ease-in-out"
                  data-ai-hint={offer.imageHint}
                />
              </div>
              <button className="save absolute top-2.5 right-2.5 text-muted-foreground bg-transparent border-none rounded-full p-1.5 text-xl cursor-pointer transition-colors duration-300 hover:text-destructive z-10">
                ♡
              </button>
            </div>
            <div className="offer-info p-3.5 md:p-4 lg:p-5 text-gray-700">
              <p className="location text-xs text-muted-foreground mb-1">{offer.location}</p>
              <p className="hotel text-xs text-muted-foreground mb-1">{offer.hotel}</p>
              <p className="title font-bold my-2 text-sm md:text-base lg:text-base leading-snug text-gray-900 h-[4.2em] overflow-hidden">
                {offer.title}
              </p>
              <div className="rating flex items-center gap-1.5 md:gap-2.5 bg-secondary px-2.5 py-1 md:px-3 md:py-1.5 rounded-full w-fit my-2.5 font-semibold text-secondary-foreground">
                <span className="score bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white font-bold px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-lg text-xs md:text-sm">
                  {offer.rating}
                </span>
                <span className="text-xs md:text-sm">{offer.ratingLabel}</span>
              </div>
              <div className="price-info">
                <p className="my-1.5 text-xs md:text-sm text-gray-600">
                  {offer.nights} nights from <strong className="text-base text-gray-800">{offer.price}</strong> /room
                </p>
                <p className="my-1.5 text-xs md:text-sm text-gray-600">
                  Valued up to <s className="text-gray-500">{offer.originalPrice}</s> <span className="discount text-teal-600 font-bold">-{offer.discount}</span>
                </p>
                <button className="view-offer mt-3 w-full md:w-auto bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white px-3 py-1.5 md:px-4 md:py-2 cursor-pointer rounded-md font-semibold text-sm md:text-base transition-opacity duration-300 ease-in-out hover:opacity-90">
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
