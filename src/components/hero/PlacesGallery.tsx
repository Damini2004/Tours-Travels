"use client";
import React from 'react';
import Image from 'next/image';
import Carousel from './Carousel'; // Ensured Carousel is imported
import ExclusiveOffers from './ExclusiveOffers';
import MoreOffers from './MoreOffers'; // Import the new component
import { HandpickedCollections } from './HandpickedCollections';

const places = [
  {
    name: 'Desert',
    image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800',
  },
  {
    name: 'Mountains',
    image: 'https://images.unsplash.com/photo-1483728642387-6c351b40b3ac?w=800',
  },
  {
    name: 'Countryside',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
  },
  {
    name: 'Beach',
    image: 'https://images.unsplash.com/photo-1473116763249-2faaef8698d5?w=800',
  },
];

const PlacesGallery = () => {
  return (
    <>
      <ExclusiveOffers />
      <MoreOffers />
      <HandpickedCollections />
      <HandpickedCollections />
      <HandpickedCollections />
      
      <Carousel /> {/* Replaced placeholder with the actual Carousel component */}

      <div className="bg-[#012d35] text-white py-10 font-sans">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center md:text-left md:pl-[180px] mb-10">
            <p className="text-2xl sm:text-xl md:text-2xl text-white/80">
              Everything travel, all in the one place
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white mt-2">
              Browse all offers to find your next <i>escape</i>
            </h1>
          </div>
        
          <section className="flex flex-col items-center justify-center p-2.5 mb-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-[1200px]">
              {places.map((place, index) => (
                <a className="block relative list-none group" href="#" key={index}>
                  <div className="pb-[110%] sm:pb-[110%] md:pb-[110%] w-full"></div> {/* Aspect ratio keeper */}
                  <div
                    className="absolute inset-0 bg-cover bg-center rounded-3xl filter brightness-75 transition-all duration-200 ease-linear group-hover:scale-105 group-hover:brightness-100"
                  >
                     <Image 
                        src={place.image} 
                        alt={place.name} 
                        layout="fill" 
                        objectFit="cover" 
                        className="rounded-3xl" 
                        data-ai-hint={place.name.toLowerCase()} // Using place.name as hint
                     />
                  </div>
                  <div className="absolute top-0 left-0 p-6">
                    <p className="text-[#00c2cb] text-sm uppercase mb-2">Places</p>
                    <h3 className="text-white text-3xl leading-tight break-words" style={{ textShadow: "2px 2px 20px rgba(0,0,0,0.5)" }}>{place.name}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PlacesGallery;
