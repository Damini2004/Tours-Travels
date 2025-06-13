
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
// REMOVED: import './Carousel.css'; // This line MUST be removed

const initialImages = [
  { name: 'Australia', image: 'https://media.kensingtontours.com/image/upload/g_auto,f_auto,q_auto,w_1366,h_768,c_fill/kt/live/pictures/asia/india-area/maldives/baa-atoll/hotel/the-nautilus/the-retreat-the-nautilus-baa-atoll-maldives-tour', hint: 'australia maldives resort' },
  { name: 'Malaysia', image: 'https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2024/10/07091202/cobia-island-fiji-1-1600x900.jpeg', hint: 'malaysia fiji island' },
  { name: 'England', image: 'https://www.nordicvisitor.com/images/switzerland/view-of-the-matterhorn-with-hikers-switzerland.jpg', hint: 'england switzerland mountains' },
  { name: 'FIJI', image: 'https://cdn.britannica.com/49/102749-050-B4874C95/Kuala-Lumpur-Malaysia.jpg', hint: 'fiji kuala lumpur' },
  { name: 'Scotland', image: 'https://www.zicasso.com/static/cf66998700d616f477da92679d4b6a93/304cc/cf66998700d616f477da92679d4b6a93.jpg', hint: 'scotland castle' },
];


const Carousel = () => {
  const [items, setItems] = useState(initialImages);
  const [transitionState, setTransitionState] = useState(''); // Renamed for clarity
  const timerRef = useRef<NodeJS.Timeout | undefined>();
  const timeRunning = 2000; // Duration for the transitionState to clear
  const timeAutoNext = 5000; // Interval for auto sliding
  const animationRef = useRef<HTMLDivElement>(null);

  const resetAnimation = () => {
    if (animationRef.current) {
      animationRef.current.classList.remove('animate'); // Assuming 'animate' class triggers 'runningTime' keyframes
      void animationRef.current.offsetWidth; // Trigger reflow
      animationRef.current.classList.add('animate');
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
    setTransitionState(type);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setTransitionState('');
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
  }, []); // Removed items from dependency array to prevent re-creating interval on item change

  return (
    <>
      <div className='mt-[-160px] w-full h-[105vh] bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] overflow-hidden relative z-0'>
        <div className={cn(`w-full h-full relative overflow-hidden`, transitionState)}>
          {/* LIST OF ITEMS */}
          <div className="absolute w-full h-full">
            {items.map((item, index) => {
              let itemClasses = "absolute bg-center bg-cover transition-all duration-1000 ease-in-out";
              let itemStyle: React.CSSProperties = { backgroundImage: `url(${item.image})` };
              let contentVisibilityClass = "hidden";
              let zIndexClass = "";

              if (index === 0) { // Main visual slide (front)
                itemClasses += " top-0 left-0 w-full h-full rounded-none";
                zIndexClass = "z-20";
              } else if (index === 1) { // Content display slide (behind main visual)
                itemClasses += " top-0 left-0 w-full h-full rounded-none";
                contentVisibilityClass = "block";
                zIndexClass = "z-10";
              } else { // Thumbnails
                itemClasses += " w-[180px] h-[250px] top-[80%] -translate-y-[70%] rounded-[20px] shadow-[0_25px_50px_rgba(0,0,0,0.3)]";
                zIndexClass = "z-[5]"; // Lower z-index for thumbnails
                if (index === 2) itemStyle.left = '67%';
                else if (index === 3) itemStyle.left = 'calc(67% + 200px)';
                else if (index === 4) itemStyle.left = 'calc(67% + 400px)';
                else if (index === 5) itemStyle.left = 'calc(67% + 600px)';
                else { // items beyond the 6th
                  itemStyle.left = 'calc(67% + 800px)';
                  itemClasses += " opacity-0";
                }
              }
              
              return (
                <div 
                  key={item.name + "_" + index} // More stable key
                  className={cn(itemClasses, zIndexClass)} 
                  style={itemStyle}
                  data-ai-hint={item.hint || "carousel image"}
                >
                  <div className={cn(
                      "absolute top-1/2 -translate-y-1/2 text-left p-5 bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] opacity-75 rounded-xl max-w-[600px] shadow-[0_8px_24px_rgba(0,0,0,0.8)] z-30", // z-30 for content to be on top
                      "left-[30px] md:left-[100px]",
                      "w-[calc(100%-60px)] md:w-[500px]",
                      "max-[400px]:mt-[70px] max-[400px]:w-[70vw]",
                      "max-[768px]:left-[30px] max-[768px]:w-[80vw]",
                      contentVisibilityClass
                    )}
                  >
                    <div className={cn(
                        "text-[48px] uppercase font-orbitron font-bold text-[#FFF8DC] opacity-0 animate-fadeInUp [text-shadow:2px_2px_10px_rgba(0,0,0,0.85)]",
                        "max-[999px]:text-[70px] max-[690px]:text-[45px]", // Responsive font sizes
                        "[animation-delay:0.6s]" 
                    )}>
                      {item.name}
                    </div>
                    <div className={cn(
                        "mt-[15px] mb-[25px] text-lg text-[#FFF8DC] leading-normal max-w-[450px] opacity-0 animate-fadeInUp [text-shadow:1px_1px_8px_rgba(0,0,0,0.7)]",
                        "max-[999px]:text-base", // Responsive font size
                        "[animation-delay:0.9s]" 
                    )}>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis culpa similique
                      consequuntur, reprehenderit dicta repudiandae.
                    </div>
                    <div className={cn(
                        "opacity-0 animate-fadeInUp",
                        "[animation-delay:1.2s]" 
                    )}>
                      <button className={cn(
                          "py-[14px] px-[32px] border-2 border-[#FFF8DC] bg-transparent text-[#FFF8DC] text-lg font-orbitron font-bold rounded-[35px] cursor-pointer transition-all duration-300 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.6)] hover:bg-[#FFF8DC] hover:text-black",
                          "max-[690px]:py-[10px] max-[690px]:px-[15px] max-[690px]:text-sm" // Responsive button
                      )}>
                        See More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ARROWS */}
          <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 z-[100] flex gap-[20px] p-[12px_20px] rounded-[24px] animate-float">
            <button 
              className="w-[56px] h-[56px] rounded-full text-white bg-transparent border-2 border-white/85 outline-none text-2xl font-orbitron font-extrabold cursor-pointer transition-all duration-300 ease hover:[transform:perspective(600px)_rotateX(0deg)] active:[transform:perspective(600px)_rotateX(0deg)]"
              onClick={() => showSlider('prev')}
            >
              {'<'}
            </button>
            <button 
              className="w-[56px] h-[56px] rounded-full text-white bg-transparent border-2 border-white/85 outline-none text-2xl font-orbitron font-extrabold cursor-pointer transition-all duration-300 ease hover:[transform:perspective(600px)_rotateX(0deg)] active:[transform:perspective(600px)_rotateX(0deg)]"
              onClick={() => showSlider('next')}
            >
              {'>'}
            </button>
          </div>
          
          {/* TIME RUNNING */}
          <div 
            className="timeRunning absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-sky-400 via-rose-400 to-lime-400 z-[100]" 
            ref={animationRef}
            style={{ width: '0%' }} 
            // The 'animate' class will be toggled by JS to trigger 'runningTime' keyframes via tailwind.config.js
          ></div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
