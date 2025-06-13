
"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'; // Import next/image
import { cn } from '@/lib/utils'; // Assuming you have a cn utility

const initialImages = [
  { name: 'Australia', image: 'https://media.kensingtontours.com/image/upload/g_auto,f_auto,q_auto,w_1366,h_768,c_fill/kt/live/pictures/asia/india-area/maldives/baa-atoll/hotel/the-nautilus/the-retreat-the-nautilus-baa-atoll-maldives-tour', hint: 'maldives hotel luxury' },
  { name: 'Malaysia', image: 'https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2024/10/07091202/cobia-island-fiji-1-1600x900.jpeg', hint: 'fiji island beach' },
  { name: 'England', image: 'https://www.nordicvisitor.com/images/switzerland/view-of-the-matterhorn-with-hikers-switzerland.jpg', hint: 'switzerland mountains hikers' },
  { name: 'FIJI', image: 'https://cdn.britannica.com/49/102749-050-B4874C95/Kuala-Lumpur-Malaysia.jpg', hint: 'kuala lumpur city' },
  { name: 'Scotland', image: 'https://www.zicasso.com/static/cf66998700d616f477da92679d4b6a93/304cc/cf66998700d616f477da92679d4b6a93.jpg', hint: 'scotland castle landscape' },
];


const Carousel = () => {
  const [items, setItems] = useState(initialImages);
  const [transition, setTransition] = useState('');
  const timerRef = useRef<NodeJS.Timeout | undefined>();
  const timeRunning = 2000; // ms
  const timeAutoNext = 7000; // ms, increased for better viewing
  const animationRef = useRef<HTMLDivElement>(null);

  const resetAnimation = () => {
    if (animationRef.current) {
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
        setTransition('next');
      } else {
        updatedItems.unshift(updatedItems.pop()!);
        setTransition('prev');
      }
      return updatedItems;
    });

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setTransition('');
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
  }, []); // Dependency on items removed to prevent reset on manual nav if items is in dep array

  return (
    <>
      <div className='carouselContainer relative mt-[-160px] w-full h-[105vh] bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] overflow-hidden z-0'>
        <div className={`carousel-list-wrapper w-full h-full relative ${transition}`}>
          <div className="list-inner absolute w-full h-full">
            {items.map((item, index) => {
              let itemClasses = "item absolute rounded-[20px] shadow-lg bg-cover bg-center transition-all duration-1000 ease-in-out";
              let contentClasses = "content absolute top-1/2 left-[100px] transform -translate-y-1/2 w-[500px] text-left hidden";
              
              // Base thumbnail style
              itemClasses += " w-[180px] h-[250px] top-[80%] transform -translate-y-[70%] z-[100]";

              if (index === 0) { // Main slide (conceptually the one that just slid in or is current)
                itemClasses = "item absolute top-0 left-0 w-full h-full rounded-none z-10"; // Main visible slide
              } else if (index === 1) { // Content display slide (conceptually the one "behind" the main, whose content is shown)
                 itemClasses = "item absolute top-0 left-0 w-full h-full rounded-none z-[9]"; // Behind main, content shown
                 contentClasses = "content absolute top-1/2 left-[30px] md:left-[100px] transform -translate-y-1/2 w-[80vw] md:w-[500px] text-left block p-5 bg-black/50 rounded-xl max-w-[600px] shadow-2xl z-20";
              } else if (index === 2) {
                itemClasses += " left-[67%] md:left-[calc(67%)]";
              } else if (index === 3) {
                itemClasses += " left-[calc(67%+200px)] md:left-[calc(67%+200px)]";
              } else if (index === 4) {
                itemClasses += " left-[calc(67%+400px)] md:left-[calc(67%+400px)]";
              } else { // items further than 5th
                itemClasses += " left-[calc(67%+600px)] opacity-0";
              }
              
              // Apply transition effects based on `transition` state
              if (transition === 'next') {
                if (index === 0) itemClasses += " animate-slideNextMain"; // Main item slides in
                else if (index === items.length -1) itemClasses += " animate-slideNextThumbOut"; // Last thumb slides out
                else itemClasses += " animate-slideNextThumb"; // Other thumbs shift
              } else if (transition === 'prev') {
                if (index === 0) itemClasses += " animate-slidePrevMain"; // Main item slides in (becomes first)
                else if (index === 1) itemClasses += " animate-slidePrevThumbBecomeMain"; // Thumb becomes main
                else itemClasses += " animate-slidePrevThumb"; // Other thumbs shift
              }


              return (
                <div 
                  key={item.name + index} 
                  className={itemClasses} 
                  style={{ backgroundImage: `url(${item.image})` }}
                  data-ai-hint={item.hint}
                >
                  <div className={contentClasses}>
                    <div className="name font-orbitron text-5xl md:text-[48px] uppercase font-bold text-[#FFF8DC] opacity-0 animate-fadeInUp animation-delay-[0.6s] text-shadow-lg">
                      {item.name}
                    </div>
                    <div className="des mt-4 mb-6 text-lg text-[#FFF8DC] leading-normal max-w-[450px] opacity-0 animate-fadeInUp animation-delay-[0.9s] text-shadow-md">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique
                      consequuntur, reprehenderit dicta repudiandae.
                    </div>
                    <div className="btn opacity-0 animate-fadeInUp animation-delay-[1.2s]">
                      <button className="py-3.5 px-8 border-2 border-[#FFF8DC] bg-transparent text-[#FFF8DC] text-lg font-bold rounded-[35px] cursor-pointer transition-all duration-300 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.6)] hover:bg-[#FFF8DC] hover:text-black">
                        See More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="arrows absolute bottom-[30px] left-1/2 transform -translate-x-1/2 z-[100] flex gap-5 p-3 rounded-3xl animate-float">
          <button 
            className="prev w-14 h-14 rounded-full text-white border-2 border-white/85 outline-none text-2xl font-orbitron font-extrabold cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/20"
            onClick={() => showSlider('prev')}
          >
            {'<'}
          </button>
          <button 
            className="next w-14 h-14 rounded-full text-white border-2 border-white/85 outline-none text-2xl font-orbitron font-extrabold cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/20"
            onClick={() => showSlider('next')}
          >
            {'>'}
          </button>
        </div>

        <div 
          className="timeRunning absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-sky-400 via-rose-400 to-lime-400 z-[100]" 
          ref={animationRef}
        ></div>
      </div>
    </>
  );
};

export default Carousel;
