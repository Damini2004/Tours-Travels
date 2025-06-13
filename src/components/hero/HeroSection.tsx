
"use client";

import VerticalCarousel from "./VerticalCarousel";
import SocialSidebar from "./SocialSidebar";
import PlacesGallery from './PlacesGallery';
import { HotelSearchForm } from "@/components/forms/hotel-search-form"; // Using HotelSearchForm

const HeroSection = () => {
  return (
    <>
      <div className="relative h-[650px] md:h-[600px] flex items-center">
        {/* Background Gradient - Can be enabled if desired */}
        {/* <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #0e3c47, #136f63, #1a5f7a)'
        }}></div> */}

        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://static.coral.org/uploads/2024/06/4-Blog-Why-Clean-Water-is-Vital-for-the-Future-of-Our-Oceans.jpg')`
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Social Sidebar */}
        <SocialSidebar />

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 flex flex-col md:flex-row items-center justify-between h-full pt-20 md:pt-0">
          {/* Left Side - Text Content & Search Form */}
          <div className="flex-1 max-w-4xl w-full">
            <div className="relative max-w-3xl mx-auto px-4 text-center md:text-left">
                <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 text-white">
                    Your Journey Begins Here
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl mx-auto md:mx-0">
                    Discover amazing places at exclusive deals. Find your next adventure with us.
                </p>
            </div>
            {/* Search Form Area - Centered on mobile, aligned with text on desktop */}
            <div className="w-full mt-4 md:mt-0">
                 <HotelSearchForm />
            </div>
          </div>

          {/* Right Side - Vertical Carousel */}
          <div className="hidden lg:flex justify-center md:justify-end md:ml-8 mt-8 md:mt-0">
            <VerticalCarousel />
          </div>
        </div>
      </div>

      {/* Bottom Places Gallery */}
      <PlacesGallery />
    </>
  );
};

export default HeroSection;
