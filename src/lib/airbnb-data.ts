
"use client";

import type { Property } from './types';

const AIRBNB_PROPERTIES_DB_KEY = 'airbnbPropertiesDB';
const defaultPropertyImage = 'https://placehold.co/600x400.png';
const defaultPropertyHint = 'property placeholder';

// Ensure all properties have necessary fields, especially for display
function sanitizeProperty(property: any, currentUser?: { email: string, fullName: string }): Property {
  const hostEmail = property.hostEmail || currentUser?.email || 'unknown_host@example.com';
  const hostName = property.hostName || currentUser?.fullName || 'Unknown Host';
  
  return {
    id: property.id || `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: property.title || 'Untitled Property',
    type: property.type || 'Unknown Type',
    location: property.location || 'Unknown Location',
    pricePerNight: typeof property.pricePerNight === 'number' ? property.pricePerNight : 0,
    rating: typeof property.rating === 'number' ? property.rating : 0,
    guests: typeof property.guests === 'number' ? property.guests : 1,
    bedrooms: typeof property.bedrooms === 'number' ? property.bedrooms : 1,
    beds: typeof property.beds === 'number' ? property.beds : 1,
    baths: typeof property.baths === 'number' ? property.baths : 1,
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    description: property.description || '',
    thumbnailUrl: property.thumbnailUrl || defaultPropertyImage,
    thumbnailHint: property.thumbnailHint || defaultPropertyHint,
    images: Array.isArray(property.images) && property.images.length > 0 ? property.images : [defaultPropertyImage],
    imageHints: Array.isArray(property.imageHints) && property.imageHints.length > 0 ? property.imageHints : [defaultPropertyHint],
    hostName: hostName,
    hostEmail: hostEmail, // Make sure hostEmail is part of Property type if you use it this way
    hostAvatarUrl: property.hostAvatarUrl, // Optional
    isSuperhost: typeof property.isSuperhost === 'boolean' ? property.isSuperhost : false,
  };
}


export function getProperties(): Property[] {
  if (typeof window === 'undefined') {
    return []; // Return empty for server-side or provide static data if needed
  }
  const storedProperties = localStorage.getItem(AIRBNB_PROPERTIES_DB_KEY);
  if (storedProperties) {
    try {
      const parsed = JSON.parse(storedProperties) as any[];
      return parsed.map(p => sanitizeProperty(p));
    } catch (e) {
      console.error("Error parsing Airbnb properties from localStorage", e);
      return [];
    }
  }
  return [];
}

export function saveProperties(properties: Property[]): void {
  if (typeof window === 'undefined') {
    console.warn("Attempted to save Airbnb properties on server side. No operation performed.");
    return;
  }
  localStorage.setItem(AIRBNB_PROPERTIES_DB_KEY, JSON.stringify(properties));
}

export function addProperty(newPropertyData: Omit<Property, 'id' | 'rating'>): Property {
  const currentProperties = getProperties();
  
  // Get current user details if available
  let currentUserDetails;
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        currentUserDetails = JSON.parse(storedUser);
      } catch (e) { console.error("Failed to parse currentUser for addProperty", e); }
    }
  }

  const propertyToAdd: Property = sanitizeProperty({
    ...newPropertyData,
    id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    rating: 0, // New properties start with 0 rating or handle differently
    // hostEmail and hostName are already in newPropertyData if provided
  }, currentUserDetails);

  const updatedProperties = [...currentProperties, propertyToAdd];
  saveProperties(updatedProperties);
  return propertyToAdd;
}

export function getPropertyById(propertyId: string): Property | undefined {
  const properties = getProperties();
  return properties.find(p => p.id === propertyId);
}

export function updateProperty(updatedPropertyData: Property): Property | undefined {
  const currentProperties = getProperties();
  const propertyIndex = currentProperties.findIndex(p => p.id === updatedPropertyData.id);

  if (propertyIndex > -1) {
    currentProperties[propertyIndex] = sanitizeProperty(updatedPropertyData);
    saveProperties(currentProperties);
    return currentProperties[propertyIndex];
  }
  console.warn(`Property with id ${updatedPropertyData.id} not found for update.`);
  return undefined;
}

export function deleteProperty(propertyId: string): boolean {
  let currentProperties = getProperties();
  const initialLength = currentProperties.length;
  currentProperties = currentProperties.filter(p => p.id !== propertyId);
  if (currentProperties.length < initialLength) {
    saveProperties(currentProperties);
    return true;
  }
  return false;
}
