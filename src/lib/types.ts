export interface Flight {
  id: string;
  airline: string;
  airlineLogoUrl?: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
  // Additional details
  departureAirport: string;
  arrivalAirport: string;
  aircraftType?: string;
  amenities?: string[];
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number; // 1-5
  pricePerNight: number;
  thumbnailUrl?: string;
  images?: string[];
  amenities: string[];
  description?: string;
  checkInTime?: string;
  checkOutTime?: string;
  roomTypes?: { name: string; price: number; features: string[] }[];
}

export interface SavedItemContextType {
  savedFlights: Flight[];
  savedHotels: Hotel[];
  addFlightToSaved: (flight: Flight) => void;
  removeFlightFromSaved: (flightId: string) => void;
  isFlightSaved: (flightId: string) => boolean;
  addHotelToSaved: (hotel: Hotel) => void;
  removeHotelFromSaved: (hotelId: string) => void;
  isHotelSaved: (hotelId: string) => boolean;
}
