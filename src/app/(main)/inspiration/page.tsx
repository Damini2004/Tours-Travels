
"use client"; 

import React from 'react';
import PopularArticles from './PopularArticles'; 
import ExclusiveOffer from "./ExclusiveOffer"; 
import Image from 'next/image'; // Import next/image

const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

const articles = [
  {
    title: "Disneyland Abu Dhabi: Everything We Know So Far",
    image: "https://images.unsplash.com/photo-1597034633844-a7de663e6396?q=80&w=800",
    hint: "abu dhabi architecture"
  },
  {
    title: "The Ultimate 5-Day Malta Itinerary for First-Time Visitors",
    image: "https://images.unsplash.com/photo-1580792229342-36c14c5c2a13?q=80&w=800",
    hint: "malta coastline"
  },
  {
    title: "5 Things We Love About Merusaka Nusa Dua Bali",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800",
    hint: "bali resort pool"
  },
  {
    title: "The Seafood Frontier: an RV Road Trip Along the Untamed Eyre Peninsula",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800", 
    hint: "australia road trip"
  },
];

const bottomArticles = [
  {
    title: "7 Things You Didn’t Know You Could Do in Hong Kong",
    image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=800",
    hint: "hong kong street"
  },
  {
    title: "You’ve Never Seen Europe Like This: Introducing Luxury Escapes’ Private Charter Tour",
    image: "https://images.unsplash.com/photo-1524850011238-e329c0e680c5?q=80&w=800",
    hint: "europe architecture"
  },
  {
    title: "Ooh La Luxe: The Best Hotels in Paris",
    image: "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=800",
    hint: "paris hotel"
  },
    {
    title: "Ooh La Luxe: The Best Hotels in Paris", 
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800", 
    hint: "paris eiffel tower"
  },
];

export default function InspirationPage() {
  return (
    <>
      <div className='bg-background' > {/* Changed to bg-background */}
        <div className="text-foreground font-sans p-8 max-w-7xl mx-auto"> {/* Changed text-white to text-foreground */}
          <h1 className="text-3xl font-headline font-semibold mb-10 text-center md:text-left text-foreground">Latest Articles</h1> {/* Changed text-white to text-foreground */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="relative w-full h-auto max-h-[400px] mb-4 aspect-video"> {/* Added aspect-video for better image display */}
                <Image
                    src="https://images.unsplash.com/photo-1506781961370-37a89d6b3095?q=80&w=800"
                    alt="Main Article"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg shadow-md"
                    data-ai-hint="kuala lumpur restaurant"
                />
              </div>
              <div className="mb-2 space-x-2 text-sm">
                <span className="bg-card text-card-foreground px-2 py-1 rounded">Explore</span>
                <span className="bg-card text-card-foreground px-2 py-1 rounded">Malaysia</span>
              </div>
              <h2 className="text-2xl font-headline font-bold mb-2 text-foreground">The Best Kuala Lumpur Restaurants</h2> {/* Changed text-white to text-foreground */}
              <a href="#" className={`${gradientTextClass} hover:opacity-80`}>Read more</a>
            </div>

            <div className="space-y-10">
              {articles.map((article, index) => (
                <div className="flex gap-4 items-start" key={index}>
                  <div className="relative rounded-md w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0">
                    <Image
                        src={article.image}
                        alt={article.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                        data-ai-hint={article.hint}
                    />
                  </div>
                  <div className="flex flex-col justify-between h-full">
                    <h3 className="font-semibold text-base mb-1 leading-tight text-foreground">{article.title}</h3> {/* Changed text-white to text-foreground */}
                    <a href="#" className={`${gradientTextClass} hover:opacity-80 text-sm mt-auto`}>Read more</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-headline font-semibold mt-16 mb-8 text-center md:text-left text-foreground">More to Explore</h2> {/* Changed text-white to text-foreground */}
          <div className="grid md:grid-cols-2 gap-10">
            {bottomArticles.map((article, index) => (
              <div className="flex gap-4 items-start" key={index}>
                 <div className="relative rounded-md w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0">
                    <Image
                        src={article.image}
                        alt={article.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                        data-ai-hint={article.hint}
                    />
                  </div>
                <div className="flex flex-col justify-between h-full">
                  <h3 className="font-semibold text-base mb-1 leading-tight text-foreground">{article.title}</h3> {/* Changed text-white to text-foreground */}
                  <a href="#" className={`${gradientTextClass} hover:opacity-80 text-sm mt-auto`}>Read more</a>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* These components likely have their own backgrounds, will need checking */}
        <PopularArticles />
        <ExclusiveOffer /> 
      </div>
    </>
  );
}
