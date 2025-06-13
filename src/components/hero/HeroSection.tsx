
"use client";

import VerticalCarousel from "./VerticalCarousel";
import SocialSidebar from "./SocialSidebar";
import PlacesGallery from './PlacesGallery';
import { FlightBooking } from "@/components/forms/FlightBooking"; // Changed path and component name

const HeroSection = () => {
  return (
    <>
      <div className="relative h-[650px] md:h-[600px] flex items-center">
        {/* Background Gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #0e3c47, #136f63, #1a5f7a)'
        }}></div>

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

        {/* Main Content Area for FlightBooking */}
        {/* The FlightBooking component is absolutely positioned internally and will overlay this section */}
        <div className="relative z-10 container mx-auto px-0 md:px-6 flex flex-col md:flex-row items-center justify-between h-full w-full">
          {/* FlightBooking will be positioned by its own absolute styling relative to this container */}
          <div className="w-full h-full flex items-center justify-center">
             {/* This inner div helps center FlightBooking if its own positioning needs a reference point within the main container */}
            <div className="relative w-full max-w-5xl"> {/* Max width to contain the form */}
                <FlightBooking />
            </div>
          </div>


          {/* Right Side - Vertical Carousel (conditionally rendered) */}
          <div className="hidden lg:flex justify-center md:justify-end md:ml-8 mt-8 md:mt-0 self-center">
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

    