
"use client";

import type { Hotel } from './types';
import { placeholderHotels } from './placeholder-data';

const HOTELS_DB_KEY = 'appHotelsDB';

export function getHotels(): Hotel[] {
  if (typeof window === 'undefined') {
    return [...placeholderHotels]; // Return a copy
  }
  const storedHotels = localStorage.getItem(HOTELS_DB_KEY);
  if (storedHotels) {
    try {
      const parsedHotels = JSON.parse(storedHotels) as Hotel[];
      // Ensure all placeholder hotels are present if DB is empty or doesn't have them
      // This logic can be refined, e.g. by only adding placeholders if DB is totally empty
      const hotelIdsInDb = new Set(parsedHotels.map(h => h.id));
      const missingPlaceholders = placeholderHotels.filter(ph => !hotelIdsInDb.has(ph.id));
      return [...parsedHotels, ...missingPlaceholders];
    } catch (e) {
      console.error("Error parsing hotels from localStorage", e);
      // If parsing fails, initialize with placeholders and save
      localStorage.setItem(HOTELS_DB_KEY, JSON.stringify(placeholderHotels));
      return [...placeholderHotels];
    }
  } else {
    // Initialize with placeholders if nothing is stored
    localStorage.setItem(HOTELS_DB_KEY, JSON.stringify(placeholderHotels));
    return [...placeholderHotels];
  }
}

export function saveHotels(hotels: Hotel[]): void {
  if (typeof window === 'undefined') {
    console.warn("Attempted to save hotels on server side. No operation performed.");
    return;
  }
  localStorage.setItem(HOTELS_DB_KEY, JSON.stringify(hotels));
}

export function addHotel(newHotel: Omit<Hotel, 'id'> & { id?: string }): Hotel {
  const hotels = getHotels();
  const hotelToAdd: Hotel = {
    ...newHotel,
    id: newHotel.id || `hotel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    images: newHotel.images || [],
    amenities: newHotel.amenities || [],
    isApproved: newHotel.isApproved === undefined ? false : newHotel.isApproved, // Default to false if not specified
  };
  const updatedHotels = [...hotels, hotelToAdd];
  saveHotels(updatedHotels);
  return hotelToAdd;
}

export function updateHotel(updatedHotel: Hotel): Hotel | undefined {
  const hotels = getHotels();
  const hotelIndex = hotels.findIndex(h => h.id === updatedHotel.id);
  if (hotelIndex > -1) {
    hotels[hotelIndex] = updatedHotel;
    saveHotels(hotels);
    return updatedHotel;
  }
  console.warn(`Hotel with id ${updatedHotel.id} not found for update.`);
  return undefined;
}

export function getHotelById(hotelId: string): Hotel | undefined {
  const hotels = getHotels();
  return hotels.find(h => h.id === hotelId);
}
