
"use client";

import type { Hotel, UltraLuxPackage } from './types';
import { placeholderHotels } from './placeholder-data';

const HOTELS_DB_KEY = 'appHotelsDB';
const ULTRA_LUX_DB_KEY = 'appUltraLuxDB'; // New key for Ultra Lux packages
const UNCONFIGURED_HOSTNAME = "dynamic-media-cdn.tripadvisor.com";


// Default Ultra Lux Package
const defaultUltraLuxPackage: UltraLuxPackage[] = [
    {
      id: "UL001",
      title: "Oceanfront Bali Hideaway with Two World-Class Restaurants & Infinity Pool",
      location: "Tabanan, Bali",
      brand: "SOORI BALI",
      imageUrls: ["https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop"],
      imageHints: ["luxury resort bali"],
      videoUrl: "https://videos.pexels.com/video-files/4222233/4222233-hd_1920_1080_25fps.mp4",
      nights: 2,
      price: 296939,
      originalPrice: 337888,
    }
];


function filterProblematicHotels(hotels: Hotel[]): Hotel[] {
  return hotels.filter(hotel => {
    const hasProblematicThumbnail = hotel.thumbnailUrl?.includes(UNCONFIGURED_HOSTNAME);
    const hasProblematicImage = hotel.images?.some(imgUrl => imgUrl.includes(UNCONFIGURED_HOSTNAME));
    if (hasProblematicThumbnail || hasProblematicImage) {
      console.warn(`Filtering out hotel "${hotel.name}" (ID: ${hotel.id}) due to image from unconfigured hostname: ${UNCONFIGURED_HOSTNAME}`);
      return false;
    }
    return true;
  });
}

export function getHotels(): Hotel[] {
  let loadedHotels: Hotel[] = [];
  if (typeof window === 'undefined') {
    loadedHotels = [...placeholderHotels]; // Return a copy for server-side
  } else {
    const storedHotels = localStorage.getItem(HOTELS_DB_KEY);
    if (storedHotels) {
      try {
        const parsedHotels = JSON.parse(storedHotels) as Hotel[];
        // Ensure all placeholder hotels are present if DB doesn't have them by ID
        const hotelIdsInDb = new Set(parsedHotels.map(h => h.id));
        const missingPlaceholders = placeholderHotels.filter(ph => !hotelIdsInDb.has(ph.id));
        loadedHotels = [...parsedHotels, ...missingPlaceholders];
      } catch (e) {
        console.error("Error parsing hotels from localStorage, initializing with placeholders.", e);
        loadedHotels = [...placeholderHotels];
        localStorage.setItem(HOTELS_DB_KEY, JSON.stringify(loadedHotels)); // Save fresh placeholders
      }
    } else {
      // Initialize with placeholders if nothing is stored
      loadedHotels = [...placeholderHotels];
      localStorage.setItem(HOTELS_DB_KEY, JSON.stringify(loadedHotels));
    }
  }
  // Filter out hotels with images from the unconfigured hostname
  return filterProblematicHotels(loadedHotels);
}

export function saveHotels(hotels: Hotel[]): void {
  if (typeof window === 'undefined') {
    console.warn("Attempted to save hotels on server side. No operation performed.");
    return;
  }
  localStorage.setItem(HOTELS_DB_KEY, JSON.stringify(hotels));
}

export function addHotel(newHotel: Omit<Hotel, 'id'> & { id?: string }): Hotel {
  // It's important to call getHotels() here to respect any ongoing filters
  // if we were to immediately use the newly added hotel.
  // However, for adding, we work with the raw stored list and then save.
  let currentRawHotels: Hotel[] = [];
  if (typeof window !== 'undefined') {
    const storedHotels = localStorage.getItem(HOTELS_DB_KEY);
    if (storedHotels) {
      try {
        currentRawHotels = JSON.parse(storedHotels);
      } catch (e) {
        console.error("Error parsing hotels for addHotel, starting fresh if necessary.", e);
        currentRawHotels = [...placeholderHotels]; // Fallback
      }
    } else {
      currentRawHotels = [...placeholderHotels]; // Initialize if empty
    }
  } else {
    currentRawHotels = [...placeholderHotels]; // Should ideally not be called server-side for adds
  }

  const hotelToAdd: Hotel = {
    ...newHotel,
    id: newHotel.id || `hotel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    images: newHotel.images || [],
    amenities: newHotel.amenities || [],
    isApproved: newHotel.isApproved === undefined ? false : newHotel.isApproved,
  };
  const updatedHotels = [...currentRawHotels, hotelToAdd];
  saveHotels(updatedHotels);
  return hotelToAdd;
}

export function updateHotel(updatedHotel: Hotel): Hotel | undefined {
  let currentRawHotels: Hotel[] = [];
   if (typeof window !== 'undefined') {
    const storedHotels = localStorage.getItem(HOTELS_DB_KEY);
    if (storedHotels) {
      try {
        currentRawHotels = JSON.parse(storedHotels);
      } catch (e) {
         console.error("Error parsing hotels for updateHotel", e);
        return undefined; // Can't update if we can't parse
      }
    } else {
      return undefined; // Can't update if no hotels are stored
    }
  } else {
    // Server-side behavior for update might need specific definition or be disallowed
    console.warn("updateHotel called on server side.");
    return undefined;
  }

  const hotelIndex = currentRawHotels.findIndex(h => h.id === updatedHotel.id);
  if (hotelIndex > -1) {
    currentRawHotels[hotelIndex] = updatedHotel;
    saveHotels(currentRawHotels);
    return updatedHotel;
  }
  console.warn(`Hotel with id ${updatedHotel.id} not found for update.`);
  return undefined;
}

export function getHotelById(hotelId: string): Hotel | undefined {
  // getHotels() already applies the filter
  const hotels = getHotels();
  return hotels.find(h => h.id === hotelId);
}

// --- Ultra Lux Package Functions ---

export function getUltraLuxPackages(): UltraLuxPackage[] {
  if (typeof window === 'undefined') {
    return [...defaultUltraLuxPackage];
  }
  const storedPackages = localStorage.getItem(ULTRA_LUX_DB_KEY);
  if (storedPackages) {
    try {
      return JSON.parse(storedPackages) as UltraLuxPackage[];
    } catch (e) {
      console.error("Error parsing Ultra Lux packages, initializing with default.", e);
      localStorage.setItem(ULTRA_LUX_DB_KEY, JSON.stringify(defaultUltraLuxPackage));
      return [...defaultUltraLuxPackage];
    }
  }
  // Initialize with default if nothing is stored
  localStorage.setItem(ULTRA_LUX_DB_KEY, JSON.stringify(defaultUltraLuxPackage));
  return [...defaultUltraLuxPackage];
}

export function saveUltraLuxPackages(packages: UltraLuxPackage[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ULTRA_LUX_DB_KEY, JSON.stringify(packages));
}

export function addUltraLuxPackage(newPackage: Omit<UltraLuxPackage, 'id'>): UltraLuxPackage {
  const currentPackages = getUltraLuxPackages();
  const packageToAdd: UltraLuxPackage = {
    ...newPackage,
    id: `ULX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageUrls: newPackage.imageUrls && newPackage.imageUrls.length > 0 ? newPackage.imageUrls : ['https://placehold.co/800x600.png/a7a29a/ffffff?text=Luxury+Stay'],
    imageHints: newPackage.imageHints && newPackage.imageHints.length > 0 ? newPackage.imageHints : ['luxury stay placeholder'],
  };
  const updatedPackages = [...currentPackages, packageToAdd];
  saveUltraLuxPackages(updatedPackages);
  return packageToAdd;
}

export function deleteUltraLuxPackage(packageId: string): UltraLuxPackage | undefined {
    const currentPackages = getUltraLuxPackages();
    const packageToDelete = currentPackages.find(p => p.id === packageId);
    if (packageToDelete) {
        const remainingPackages = currentPackages.filter(p => p.id !== packageId);
        saveUltraLuxPackages(remainingPackages);
        return packageToDelete;
    }
    return undefined;
}
