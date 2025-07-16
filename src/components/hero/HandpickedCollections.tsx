
"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const collections = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=400",
    hint: "delhi monument",
    top: 8,
    title: "Stays in & Around Delhi for a Weekend Getaway",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=400",
    hint: "mumbai sea",
    top: 8,
    title: "Stays in & Around Mumbai for a Weekend Getaway",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=400",
    hint: "bangalore palace",
    top: 9,
    title: "Stays in & Around Bangalore for a Weekend Getaway",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1507525428034-b723a996f329?q=80&w=400",
    hint: "beach destination",
    top: 11,
    title: "Beach Destinations",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=400",
    hint: "mountain road",
    top: 11,
    title: "Weekend Getaways",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1588432141548-5450c36f01de?q=80&w=400",
    hint: "snowy mountain",
    top: 11,
    title: "Hill Stations",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=400",
    hint: "tropical paradise",
    top: 10,
    title: "Tropical Paradise",
  }
];

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

export function HandpickedCollections() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.7;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-background text-foreground font-sans px-2.5 md:px-[50px] pt-[30px] pb-12 md:pb-16 min-h-[auto] box-border">
      <div className="flex justify-between items-center mb-5 md:mb-8 md:mx-0 lg:mx-[50px]">
        <h2 className="text-2xl md:text-3xl lg:text-[45px] text-gray-900 font-semibold">
          Handpicked <em className={`${gradientTextClass} not-italic`}>Collections for You</em>
        </h2>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full border-gray-300 hover:bg-gray-100" onClick={() => scroll('left')}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-gray-300 hover:bg-gray-100" onClick={() => scroll('right')}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
      
      <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-5 mt-5 -mx-4 px-4 pb-4">
        {collections.map((collection) => (
          <div key={collection.id} className="group relative w-[220px] h-[300px] flex-shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            {/* Background Image */}
            <Image
              src={collection.image}
              alt={collection.title}
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={collection.hint}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 p-4 z-20 text-white w-full">
              <span className="bg-white/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                TOP {collection.top}
              </span>
              <h3 className="mt-2 text-base font-semibold leading-snug drop-shadow-lg">
                {collection.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
