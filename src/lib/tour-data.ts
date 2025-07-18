
"use client";

import type { TourPackage } from './types';

const TOURS_DB_KEY = 'appToursDB';

// Placeholder data for initial load
const placeholderTours: TourPackage[] = [
  {
    id: "TOUR001",
    title: "Ultimate Europe by Private Charter Flight: Luxury Escapes 25-Day Tour with 9 Bucket-List Countries",
    location: "Stays in Prague, Ends in Istanbul",
    tourType: "Luxury Escapes Tours",
    durationDays: 25,
    price: 1741524,
    originalPrice: 1850000,
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "european city skyline"
  },
  {
    id: "TOUR002",
    title: "Signature Series: Southern Africa Exclusive Safari with Jason Edwards, National Geographic photographer",
    location: "Stays in Johannesburg, Ends in Victoria Falls",
    tourType: "Luxury Escapes Tours - Signature Series",
    durationDays: 9,
    price: 702104,
    originalPrice: 750000,
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "lion sunset safari"
  },
  {
    id: "TOUR003",
    title: "Deluxe 9-Day Egypt Highlights with Cairo, Aswan & Luxor",
    location: "Stays in Cairo, Ends in Cairo",
    tourType: "Luxury Escapes Tours",
    durationDays: 9,
    price: 241518,
    originalPrice: 280000,
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "egyptian temple interior"
  },
  {
    id: "TOUR004",
    title: "Premium 6-Day Kenya Safari 2026 with Luxury Fairmont Lodge, Maasai Mara & Nairobi",
    location: "Stays in Nairobi, Ends in Nairobi",
    tourType: "Luxury Escapes Tours - Premium",
    durationDays: 6,
    price: 581744,
    originalPrice: 700000,
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "zebra safari kenya"
  },
  {
    id: "TOUR005",
    title: "Premium 6-Day Private Finland Aurora Winter Adventure with Rovaniemi & Saariselkä",
    location: "Stays in Rovaniemi, Ends in Ivalo",
    tourType: "Luxury Escapes Tours - Premium",
    durationDays: 6,
    price: 544890,
    originalPrice: 600000,
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "northern lights glass igloo"
  },
];


export function getTourPackages(): TourPackage[] {
  if (typeof window === 'undefined') {
    return [...placeholderTours];
  }
  const storedTours = localStorage.getItem(TOURS_DB_KEY);
  if (storedTours) {
    try {
      const parsed = JSON.parse(storedTours) as TourPackage[];
      return parsed.length > 0 ? parsed : [...placeholderTours];
    } catch (e) {
      console.error("Error parsing tour packages, returning placeholders.", e);
      return [...placeholderTours];
    }
  }
  // Initialize with placeholders if nothing is stored
  localStorage.setItem(TOURS_DB_KEY, JSON.stringify(placeholderTours));
  return [...placeholderTours];
}

export function getTourPackageById(id: string): TourPackage | undefined {
    const packages = getTourPackages();
    return packages.find(pkg => pkg.id === id);
}

export function saveTourPackages(packages: TourPackage[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOURS_DB_KEY, JSON.stringify(packages));
}

export function addTourPackage(newPackage: Omit<TourPackage, 'id'>): TourPackage {
  const currentPackages = getTourPackages();
  const packageToAdd: TourPackage = {
    ...newPackage,
    id: `TOUR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  const updatedPackages = [...currentPackages, packageToAdd];
  saveTourPackages(updatedPackages);
  return packageToAdd;
}

export function deleteTourPackage(packageId: string): TourPackage | undefined {
  const currentPackages = getTourPackages();
  const packageToDelete = currentPackages.find(p => p.id === packageId);
  if (packageToDelete) {
      const remainingPackages = currentPackages.filter(p => p.id !== packageId);
      saveTourPackages(remainingPackages);
      return packageToDelete;
  }
  return undefined;
}
