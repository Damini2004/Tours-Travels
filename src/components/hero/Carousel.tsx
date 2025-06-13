
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility
import Image from 'next/image'; // Import next/image

// Original image data from user
const initialImages = [
  { name: 'Australia', image: 'https://media.kensingtontours.com/image/upload/g_auto,f_auto,q_auto,w_1366,h_768,c_fill/kt/live/pictures/asia/india-area/maldives/baa-atoll/hotel/the-nautilus/the-retreat-the-nautilus-baa-atoll-maldives-tour', hint: 'maldives hotel luxury' },
  { name: 'Malaysia', image: 'https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2024/10/07091202/cobia-island-fiji-1-1600x900.jpeg', hint: 'fiji island beach' },
  { name: 'England', image: 'https://www.nordicvisitor.com/images/switzerland/view-of-the-matterhorn-with-hikers-switzerland.jpg', hint: 'switzerland mountains hikers' },
  { name: 'FIJI', image: 'https://cdn.britannica.com/49/102749-050-B4874C95/Kuala-Lumpur-Malaysia.jpg', hint: 'kuala lumpur city' },
  { name: 'Scotland', image: 'https://www.zicasso.com/static/cf66998700d616f477da92679d4b6a93/304cc/cf66998700d616f477da92679d4b6a93.jpg', hint: 'scotland castle landscape' },
];


const Carousel = () => {
  const [items, setItems] = useState(initialImages);
  // The 'transition' state variable isn't directly used for CSS classes on the main carousel or items
  // in the user's provided CSS logic, but it's part of their JS.
  const [transitionState, setTransitionState] = useState('');
  const timerRef = useRef<NodeJS.Timeout | undefined>();
  const timeRunning = 2000; // ms for transitionState to clear
  const timeAutoNext = 7000; // ms for auto slide
  const animationRef = useRef<HTMLDivElement>(null);

  const resetAnimation = () => {
    if (animationRef.current) {
      // Assumes 'animate-runningTime' is the utility class from tailwind.config.js
      animationRef.current.classList.remove('animate-runningTime');
      void animationRef.current.offsetWidth; // Trigger reflow
      animationRef.current.classList.add('animate-runningTime');
    }
  };

  const showSlider = (type: 'next' | 'prev') => {
    setItems(currentItems => {
      let updatedItems = [...currentItems];
      if (type === 'next') {
        updatedItems.push(updatedItems.shift()!);
      } else {
        updatedItems.unshift(updatedItems.pop()!);
      }
      return updatedItems;
    });
    setTransitionState(type); // Used to mark that a transition is happening

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setTransitionState(''); // Clear the transition state
    }, timeRunning);

    resetAnimation();
  };

  useEffect(() => {
    const auto = setInterval(() => {
      showSlider('next');
    }, timeAutoNext);
    return () => {
      clearInterval(auto);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removed 'items' from dependency array to prevent interval reset on manual nav

  return (
    <>
      <div className='carouselContainer relative mt-[-160px] w-full h-[105vh] bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] overflow-hidden z-0'>
        {/* The `transitionState` isn't directly applied as a class here in the user's CSS logic for overall carousel animation */}
        <div className={`carousel w-full h-full relative overflow-hidden`}>
          <div className="list absolute w-full h-full">
            {items.map((item, index) => {
              
              // Base styles for all items (thumbnails by default)
              let itemBaseClasses = "absolute w-[180px] h-[250px] top-[80%] -translate-y-[70%] rounded-[20px] shadow-lg bg-cover bg-center transition-all duration-1000 ease-in-out z-[100]";
              let itemPositionStyle: React.CSSProperties = {};
              let contentVisibilityClass = "hidden";

              if (index === 0) { // Main visible slide (front-most)
                itemBaseClasses = "absolute top-0 left-0 w-full h-full rounded-none z-10 transition-all duration-1000 ease-in-out bg-cover bg-center";
              } else if (index === 1) { // Slide whose content is shown (behind main slide)
                itemBaseClasses = "absolute top-0 left-0 w-full h-full rounded-none z-[9] transition-all duration-1000 ease-in-out bg-cover bg-center";
                contentVisibilityClass = "block"; // Content for this slide is visible
              } else if (index === 2) { // First visible thumbnail
                itemPositionStyle = { left: '67%' };
              } else if (index === 3) { // Second visible thumbnail
                itemPositionStyle = { left: 'calc(67% + 200px)' };
              } else if (index === 4) { // Third visible thumbnail
                itemPositionStyle = { left: 'calc(67% + 400px)' };
              } else { // Subsequent thumbnails are further out and might be hidden or faded
                itemPositionStyle = { left: `calc(67% + ${200 * (index - 2)}px)`, opacity: index < 5 ? 1 : 0 };
                 if (index >= 5) itemBaseClasses += " opacity-0"; // Corresponds to :nth-child(n+6 or 7)
              }
              
              return (
                <div 
                  key={item.name + index} 
                  className={cn(itemBaseClasses)} 
                  style={{ ...itemPositionStyle, backgroundImage: `url(${item.image})` }}
                  data-ai-hint={item.hint}
                >
                  <div className={cn(
                      "content absolute top-1/2 left-[30px] md:left-[100px] -translate-y-1/2 w-[80vw] md:w-[500px] text-left p-5 bg-black/50 rounded-xl max-w-[600px] shadow-2xl z-20",
                      contentVisibilityClass
                    )}
                  >
                    <div className="name font-orbitron text-[48px] uppercase font-bold text-[#FFF8DC] opacity-0 animate-fadeInUp [animation-delay:0.6s]">
                      {item.name}
                    </div>
                    <div className="des mt-4 mb-6 text-lg text-[#FFF8DC] leading-normal max-w-[450px] opacity-0 animate-fadeInUp [animation-delay:0.9s]">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique
                      consequuntur, reprehenderit dicta repudiandae.
                    </div>
                    <div className="btn opacity-0 animate-fadeInUp [animation-delay:1.2s]">
                      <button className="py-3.5 px-8 border-2 border-[#FFF8DC] bg-transparent text-[#FFF8DC] text-lg font-bold rounded-[35px] cursor-pointer transition-all duration-300 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.6)] hover:bg-[#FFF8DC] hover:text-black">
                        See More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="arrows absolute bottom-[30px] left-1/2 -translate-x-1/2 z-[100] flex gap-5 p-3 rounded-3xl animate-float">
            <button 
              className="prev w-14 h-14 rounded-full text-white bg-transparent border-2 border-white/85 outline-none text-2xl font-orbitron font-extrabold cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/20"
              onClick={() => showSlider('prev')}
            >
              {'<'}
            </button>
            <button 
              className="next w-14 h-14 rounded-full text-white bg-transparent border-2 border-white/85 outline-none text-2xl font-orbitron font-extrabold cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/20"
              onClick={() => showSlider('next')}
            >
              {'>'}
            </button>
          </div>
          {/* Time running bar - assuming animate-runningTime is correctly defined in tailwind.config.js */}
          <div 
            className="timeRunning absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-sky-400 via-rose-400 to-lime-400 z-[100]" 
            ref={animationRef}
            style={{ width: '0%' }} // Initial width for JS animation
          ></div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
