
"use client";

import { useState, useEffect, useMemo } from "react";
import { format, parseISO, isValid } from "date-fns";
import { useRouter } from "next/navigation";
import { Plane, Building, Home as HomeIcon, Palmtree, Car, ChevronDown, Search, ArrowLeftRight, Calendar as CalendarIconLucide, MinusIcon, PlusIcon, UsersIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface Location { city: string; code: string; airport: string; country: string; }
interface PassengerCounts { adults: number; children: number; infants: number; }

const services = [
  { id: 'flights', icon: Plane, label: "Flights" },
  { id: 'hotels', icon: Building, label: "Hotels" },
  { id: 'homestays', icon: HomeIcon, label: "Homestays" },
  { id: 'packages', icon: Palmtree, label: "Packages" },
  { id: 'cabs', icon: Car, label: "Cabs" },
];

const popularCities: Location[] = [
  { city: "Mumbai", code: "BOM", airport: "Chhatrapati Shivaji International Airport", country: "India" },
  { city: "New Delhi", code: "DEL", airport: "Indira Gandhi International Airport", country: "India" },
  { city: "Bangkok", code: "BKK", airport: "Bangkok Suvarnabhumi Airport", country: "Thailand" },
  { city: "Bengaluru", code: "BLR", airport: "Kempegowda International Airport Bengaluru", country: "India" },
  { city: "Pune", code: "PNQ", airport: "Pune Airport", country: "India" },
  { city: "Chennai", code: "MAA", airport: "Chennai International Airport", country: "India" },
  { city: "Kolkata", code: "CCU", airport: "Netaji Subhas Chandra Bose International Airport", country: "India" },
  { city: "Hyderabad", code: "HYD", airport: "Rajiv Gandhi International Airport", country: "India" },
];

const travelClasses = ["Economy", "Premium Economy", "Business", "First Class"];

const specialFares = [
    { id: "regular", label: "Regular", subLabel: "Regular fares" },
    { id: "student", label: "Student", subLabel: "Extra discounts" },
    { id: "senior", label: "Senior Citizen", subLabel: "Up to ₹600 off" },
    { id: "armedforces", label: "Armed Forces", subLabel: "Up to ₹600 off" },
    { id: "doctors", label: "Doctors/Nurses", subLabel: "Up to ₹600 off" },
];


export function FlightBooking() {
  const initialDepartureDate = new Date();
  initialDepartureDate.setDate(initialDepartureDate.getDate() + 1); // Default to tomorrow

  const [activeService, setActiveService] = useState('flights');

  // Flight state
  const [flightState, setFlightState] = useState({
    tripType: "oneWay" as "oneWay" | "roundTrip" | "multiCity",
    from: popularCities.find(c => c.code === "DEL") || popularCities[1],
    to: popularCities.find(c => c.code === "BLR") || popularCities[3],
    departure: initialDepartureDate,
    return: undefined as Date | undefined,
    travelClass: "Economy",
    specialFare: "regular",
    fromOpen: false,
    toOpen: false,
    departureOpen: false,
    returnOpen: false,
    travellersOpen: false,
    fromSearch: "",
    toSearch: "",
    passengers: { adults: 1, children: 0, infants: 0 } as PassengerCounts,
    currentMonth: new Date(initialDepartureDate.getFullYear(), initialDepartureDate.getMonth(), 1),
  });

  // Hotel state
  const [hotelState, setHotelState] = useState({
    location: '',
    checkInDate: undefined as Date | undefined,
    checkOutDate: undefined as Date | undefined,
    rooms: 1,
    adults: 2,
    priceRange: '',
  });

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (flightState.departure < today) {
        const nextValidDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        updateFlightState({
            departure: nextValidDate,
            currentMonth: new Date(nextValidDate.getFullYear(), nextValidDate.getMonth(), 1)
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const updateFlightState = (updates: Partial<typeof flightState>) => setFlightState((prev) => ({ ...prev, ...updates }));
  const updateHotelState = (updates: Partial<typeof hotelState>) => setHotelState((prev) => ({ ...prev, ...updates }));

  const handleSwap = () => updateFlightState({ from: flightState.to, to: flightState.from });

  const handleCity = (loc: Location, type: "from" | "to") =>
    updateFlightState({ [type]: loc, [`${type}Open`]: false, [`${type}Search`]: "" });

  const handleDate = (date: Date | undefined, type: "departure" | "return") => {
    if (date) {
        const updates: Partial<typeof flightState> = { [type]: date, [`${type}Open`]: false };
        if (type === "departure") {
            updates.currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            if (flightState.return && date > flightState.return) {
                updates.return = undefined;
            }
        }
        updateFlightState(updates);
    }
  }

  const totalPassengers = () => flightState.passengers.adults + flightState.passengers.children + flightState.passengers.infants;

  const applyTravellers = () => {
    const total = totalPassengers();
    if (total > 0) updateFlightState({ travelClass: flightState.travelClass, travellersOpen: false });
  };

  const filteredCities = (type: "from" | "to") =>
    popularCities.filter((c) =>
      [c.city, c.code, c.airport, c.country].some((v) => v.toLowerCase().includes(flightState[`${type}Search`].toLowerCase()))
    );

  const mapClass = (c: string) =>
    ({ "Premium Economy": "PREMIUM_ECONOMY", Business: "BUSINESS", "First Class": "FIRST" }[c] || "ECONOMY");

  const searchFlights = () => {
    if (!flightState.from || !flightState.to || !flightState.departure) return alert("Please fill in all required fields.");
    if (flightState.tripType === "roundTrip" && !flightState.return) return alert("Please select a return date.");
    if (flightState.tripType === "multiCity") return alert("Multi-city search is not supported yet.");

    const params = new URLSearchParams({
      originLocationCode: flightState.from.code.toUpperCase(),
      destinationLocationCode: flightState.to.code.toUpperCase(),
      departureDate: format(flightState.departure, "yyyy-MM-dd"),
      adults: flightState.passengers.adults.toString(),
      children: flightState.passengers.children.toString(),
      infants: flightState.passengers.infants.toString(),
      travelClass: mapClass(flightState.travelClass),
    });

    if (flightState.tripType === "roundTrip" && flightState.return) {
      params.append("returnDate", format(flightState.return, "yyyy-MM-dd"));
    }
    router.push(`/flights/search?${params.toString()}`);
  };

  const searchHotels = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (hotelState.location) queryParams.set('location', hotelState.location);
    if (hotelState.checkInDate) queryParams.set('checkInDate', format(hotelState.checkInDate, 'yyyy-MM-dd'));
    if (hotelState.checkOutDate) queryParams.set('checkOutDate', format(hotelState.checkOutDate, 'yyyy-MM-dd'));
    queryParams.set('guests', String(hotelState.adults));
    if (hotelState.priceRange) queryParams.set('price', hotelState.priceRange);

    router.push(`/hotels/search?${queryParams.toString()}`);
  };

  const handleGuestChange = (type: 'rooms' | 'adults', operation: 'increment' | 'decrement') => {
    if (type === 'rooms') {
      updateHotelState({ rooms: operation === 'increment' ? hotelState.rooms + 1 : Math.max(1, hotelState.rooms - 1) });
    } else {
      updateHotelState({ adults: operation === 'increment' ? hotelState.adults + 1 : Math.max(1, hotelState.adults - 1) });
    }
  };

  if (!isClient) {
    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] h-12"></div>
                <div className="p-4 md:p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 items-stretch">
                        <div className="h-[76px] bg-gray-200 rounded md:col-span-3"></div>
                        <div className="h-[76px] bg-gray-200 rounded md:col-span-1 flex items-center justify-center"><ArrowLeftRight className="w-5 h-5 text-gray-300"/></div>
                        <div className="h-[76px] bg-gray-200 rounded md:col-span-3"></div>
                        <div className="h-[76px] bg-gray-200 rounded md:col-span-2"></div>
                        <div className="h-[76px] bg-gray-200 rounded md:col-span-3"></div>
                    </div>
                     <div className="h-20 bg-gray-200 rounded w-full"></div>
                    <div className="flex justify-center mt-6">
                        <div className="h-12 bg-gray-300 rounded w-full max-w-xs"></div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  const LocationPopover = ({ type }: { type: "from" | "to" }) => (
    <Popover open={flightState[`${type}Open`]} onOpenChange={(open) => updateFlightState({ [`${type}Open`]: open })}>
      <PopoverTrigger asChild>
        <button className="border border-gray-300 rounded-lg p-2 hover:border-sky-300 text-left w-full h-[76px] bg-white relative flex flex-col justify-center">
            <div className="text-xs text-gray-500 mb-0.5">{type === "from" ? "From" : "To"}</div>
            <div className="font-bold text-lg text-slate-900 leading-tight truncate">{flightState[type].city}</div>
            <div className="text-xs text-gray-600 truncate">{flightState[type].code}, {flightState[type].country}</div>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 absolute right-2 top-1/2 -translate-y-1/2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search city/airport/code"
              value={flightState[`${type}Search`]}
              onChange={(e) => updateFlightState({ [`${type}Search`]: e.target.value })}
              className="pl-8 text-sm h-10 bg-white border-gray-300 text-slate-900 placeholder-gray-400 focus:border-sky-300"
            />
          </div>
        </div>
        <div className="p-3">
          <h4 className="text-xs text-gray-500 mb-2 font-medium">Popular Cities</h4>
          <ScrollArea className="h-48">
            {filteredCities(type).length ? (
              filteredCities(type).map((city) => (
                <button
                  key={city.code}
                  className="flex justify-between p-2 hover:bg-gray-50 rounded w-full text-left items-center"
                  onClick={() => handleCity(city, type)}
                >
                  <div>
                    <div className="font-medium text-sm text-slate-800">{city.city}, {city.country}</div>
                    <div className="text-xs text-gray-500">{city.airport}</div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">{city.code}</div>
                </button>
              ))
            ) : (
              <div className="text-xs text-gray-500 p-2">No cities found</div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );

  const DatePopover = ({ type }: { type: "departure" | "return" }) => (
    <Popover open={flightState[`${type}Open`]} onOpenChange={(open) => updateFlightState({ [`${type}Open`]: open })}>
      <PopoverTrigger asChild>
         <button className="border border-gray-300 rounded-lg p-2 hover:border-sky-300 text-left w-full h-[76px] bg-white relative flex flex-col justify-center">
            <div className="text-xs text-gray-500 mb-0.5">{type === "departure" ? "Departure" : "Return"}</div>
             {type === "return" && !flightState.return ? (
                <div className="text-sm text-gray-400 py-1">Tap to select</div>
             ) : (
                <>
                    <div className="font-bold text-lg text-slate-900 leading-tight">
                        {flightState[type] ? format(flightState[type]!, "d") : ""} <span className="font-normal text-sm">{flightState[type] ? format(flightState[type]!, "MMM") : ""}</span>
                    </div>
                    <div className="text-xs text-gray-600">{flightState[type] ? format(flightState[type]!, "EEE") : ""}</div>
                </>
             )}
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 absolute right-2 top-1/2 -translate-y-1/2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="start">
        <div className="p-4">
          <Calendar
            mode="single"
            selected={flightState[type]}
            onSelect={(date) => handleDate(date, type)}
            month={flightState.currentMonth}
            onMonthChange={(month) => updateFlightState({ currentMonth: month })}
            initialFocus
            disabled={(date) => {
                const today = new Date();
                today.setHours(0,0,0,0);
                if (type === "departure") return date < today;
                if (type === "return") return flightState.departure ? date < flightState.departure : date < today;
                return false;
            }}
          />
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => updateFlightState({ [`${type}Open`]: false })}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1 rounded text-sm"
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] flex justify-center px-4 py-2">
          <div className="flex overflow-x-auto scrollbar-hide space-x-3">
            {services.map((s, i) => {
              const IconComponent = s.icon;
              const isEnabled = s.id === 'flights' || s.id === 'hotels';
              return (
                <button
                  key={i}
                  className={cn(
                    "px-2.5 py-1 transition-all rounded-md",
                    activeService === s.id ? "border-b-2 border-white text-white bg-[#ffffff1a]" : "text-gray-300",
                    isEnabled ? "cursor-pointer hover:text-white hover:bg-[#ffffff10]" : "cursor-not-allowed opacity-50"
                  )}
                  onClick={() => isEnabled && setActiveService(s.id)}
                  disabled={!isEnabled}
                >
                  <div className="flex items-center space-x-1">
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{s.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 md:p-6">
          {activeService === 'flights' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex gap-2">
                  {["oneWay", "roundTrip", "multiCity"].map((type) => (
                    <label key={type} className="flex items-center cursor-pointer p-1 rounded hover:bg-gray-100">
                      <input
                        type="radio"
                        name="tripType"
                        value={type}
                        checked={flightState.tripType === type}
                        onChange={(e) => updateFlightState({ tripType: e.target.value as typeof flightState.tripType })}
                        className="w-3.5 h-3.5 text-sky-300 border-gray-300 focus:ring-sky-300"
                      />
                      <span className={cn("ml-1 text-xs font-medium", flightState.tripType === type ? "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent" : "text-slate-700")}>{type === "oneWay" ? "One Way" : type === "roundTrip" ? "Round Trip" : "Multi City"}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 items-stretch">
                  <div className="md:col-span-3"><LocationPopover type="from" /></div>
                  <div className="md:col-span-1 flex items-center justify-center">
                      <Button variant="outline" size="icon" onClick={handleSwap} className="p-2 hover:bg-gray-100 rounded-full h-10 w-10 shrink-0 border-gray-300 text-gray-600">
                          <ArrowLeftRight className="w-4 h-4" />
                      </Button>
                  </div>
                  <div className="md:col-span-3"><LocationPopover type="to" /></div>
                  <div className="md:col-span-2"><DatePopover type="departure" /></div>
                  {flightState.tripType === "roundTrip" && (
                      <div className="md:col-span-2"><DatePopover type="return" /></div>
                  )}
                  <div className={cn(flightState.tripType === "roundTrip" ? "md:col-span-1" : "md:col-span-3")}>
                      <Popover open={flightState.travellersOpen} onOpenChange={(open) => updateFlightState({ travellersOpen: open })}>
                          <PopoverTrigger asChild>
                              <button className="border border-gray-300 rounded-lg p-2 hover:border-sky-300 text-left w-full h-[76px] bg-white relative flex flex-col justify-center">
                                  <div className="text-xs text-gray-500 mb-0.5">Travellers & Class</div>
                                  <div className="font-bold text-lg text-slate-900 leading-tight truncate">{totalPassengers()} Traveller{totalPassengers() > 1 ? "s" : ""}</div>
                                  <div className="text-xs text-gray-600 truncate">{flightState.travelClass}</div>
                                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 absolute right-2 top-1/2 -translate-y-1/2" />
                              </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-0">
                          <div className="p-4 space-y-4">
                              {[
                                  {key: "adults", label: "ADULTS (12y +)", options: [1, 2, 3, 4, 5, 6, 7, 8, 9]},
                                  {key: "children", label: "CHILDREN (2y - 12y)", options: [0, 1, 2, 3, 4, 5, 6]},
                                  {key: "infants", label: "INFANTS (below 2y)", options: [0, 1, 2, 3, 4]}
                              ].map((item) => (
                              <div key={item.key} className="space-y-2">
                                  <div className="font-semibold text-sm text-gray-700">{item.label}</div>
                                  <ScrollArea className="h-14">
                                      <div className="flex gap-2 flex-wrap pb-2">
                                      {item.options.map((num) => (
                                          <button
                                          key={num}
                                          onClick={() =>
                                              updateFlightState({
                                              passengers: {
                                                  ...flightState.passengers,
                                                  [item.key as keyof PassengerCounts]: num,
                                              },
                                              })
                                          }
                                          className={cn(
                                              "w-8 h-8 rounded text-xs font-medium border",
                                              flightState.passengers[item.key as keyof PassengerCounts] === num
                                              ? "bg-sky-500 text-white border-sky-500"
                                              : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800"
                                          )}
                                          >
                                          {num}
                                          </button>
                                      ))}
                                      </div>
                                  </ScrollArea>
                              </div>
                              ))}
                              <div className="space-y-2">
                              <div className="font-semibold text-sm text-gray-700">TRAVEL CLASS</div>
                              <div className="grid grid-cols-2 gap-2">
                                  {travelClasses.map((c) => (
                                  <button
                                      key={c}
                                      onClick={() => updateFlightState({ travelClass: c })}
                                      className={cn(
                                      "px-3 py-1.5 rounded text-xs font-medium border",
                                      flightState.travelClass === c ? "bg-sky-500 text-white border-sky-500" : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800"
                                      )}
                                  >
                                      {c}
                                  </button>
                                  ))}
                              </div>
                              </div>
                              <div className="flex justify-end pt-2">
                              <Button
                                  onClick={applyTravellers}
                                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-1.5 rounded-md text-sm"
                                  disabled={totalPassengers() === 0}
                              >
                                  Apply
                              </Button>
                              </div>
                          </div>
                          </PopoverContent>
                      </Popover>
                  </div>
              </div>

              <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800 text-sm">Select A Special Fare</h3>
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">Save More</span>
                  </div>
                  <RadioGroup
                      value={flightState.specialFare}
                      onValueChange={(value) => updateFlightState({ specialFare: value })}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2"
                  >
                      {specialFares.map((fare) => (
                      <Label
                          key={fare.id}
                          htmlFor={`fare-${fare.id}`}
                          className={cn(
                          "border rounded-md p-1.5 text-center cursor-pointer transition-all duration-200",
                          flightState.specialFare === fare.id
                              ? "border-sky-300 bg-sky-300/10 shadow-md ring-1 ring-sky-300"
                              : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm"
                          )}
                      >
                          <RadioGroupItem value={fare.id} id={`fare-${fare.id}`} className="sr-only peer" />
                          <div className={cn("font-medium text-xs text-slate-800", flightState.specialFare === fare.id && "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent")}>{fare.label}</div>
                          <div className={cn("text-xxs text-gray-500 mt-0.5", flightState.specialFare === fare.id && "text-sky-500/80")}>{fare.subLabel}</div>
                      </Label>
                      ))}
                  </RadioGroup>
              </div>

              <div className="flex justify-center pt-3">
                <Button
                  onClick={searchFlights}
                  className="w-full max-w-xs h-11 bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] hover:opacity-90 text-white px-8 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Search Flights
                </Button>
              </div>
            </div>
          )}

          {activeService === 'hotels' && (
             <form onSubmit={searchHotels} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2 items-end">
                  <div className="lg:col-span-3 space-y-1">
                    <Label htmlFor="location" className="text-xs font-medium text-gray-700 px-1">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Property or Location"
                      value={hotelState.location}
                      onChange={(e) => updateHotelState({ location: e.target.value })}
                      required
                      className="h-11 text-base bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-sky-300"
                    />
                  </div>

                  <div className="lg:col-span-2 space-y-1">
                    <Label htmlFor="checkin-date" className="text-xs font-medium text-gray-700 px-1">Check-in</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-11 justify-start text-left font-normal border-gray-300">
                          <CalendarIconLucide className="mr-2 h-4 w-4" />
                          {hotelState.checkInDate ? format(hotelState.checkInDate, 'dd MMM yy') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={hotelState.checkInDate} onSelect={(date) => updateHotelState({checkInDate: date})} initialFocus disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} /></PopoverContent>
                    </Popover>
                  </div>

                  <div className="lg:col-span-2 space-y-1">
                    <Label htmlFor="checkout-date" className="text-xs font-medium text-gray-700 px-1">Check-out</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-11 justify-start text-left font-normal border-gray-300">
                          <CalendarIconLucide className="mr-2 h-4 w-4" />
                          {hotelState.checkOutDate ? format(hotelState.checkOutDate, 'dd MMM yy') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={hotelState.checkOutDate} onSelect={(date) => updateHotelState({checkOutDate: date})} disabled={(date) => hotelState.checkInDate ? date <= hotelState.checkInDate : date < new Date(new Date().setHours(0,0,0,0))} /></PopoverContent>
                    </Popover>
                  </div>

                  <div className="lg:col-span-3 space-y-1">
                    <Label htmlFor="guests-rooms" className="text-xs font-medium text-gray-700 px-1">Rooms & Guests</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-11 justify-start text-left font-normal border-gray-300">
                          <UsersIcon className="mr-2 h-4 w-4" />
                          <span>{hotelState.rooms} Room, {hotelState.adults} Adults</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label>Rooms</Label>
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleGuestChange('rooms', 'decrement')}><MinusIcon className="h-4 w-4" /></Button>
                              <span className="w-4 text-center">{hotelState.rooms}</span>
                              <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleGuestChange('rooms', 'increment')}><PlusIcon className="h-4 w-4" /></Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <Label>Adults</Label>
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleGuestChange('adults', 'decrement')}><MinusIcon className="h-4 w-4" /></Button>
                              <span className="w-4 text-center">{hotelState.adults}</span>
                              <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => handleGuestChange('adults', 'increment')}><PlusIcon className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="lg:col-span-2 space-y-1">
                    <Label htmlFor="price-range" className="text-xs font-medium text-gray-700 px-1">Price per night</Label>
                    <Select value={hotelState.priceRange} onValueChange={(value) => updateHotelState({priceRange: value})}>
                      <SelectTrigger id="price-range" className="w-full h-11 border-gray-300">
                        <SelectValue placeholder="Select a price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1500">₹0 - ₹1500</SelectItem>
                        <SelectItem value="1500-2500">₹1500 - ₹2500</SelectItem>
                        <SelectItem value="2500-5000">₹2500 - ₹5000</SelectItem>
                        <SelectItem value="5000+">₹5000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-center pt-3">
                    <Button
                        type="submit"
                        className="w-full max-w-xs h-11 bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] hover:opacity-90 text-white px-8 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                        Search Hotels
                    </Button>
                </div>
             </form>
          )}
        </div>
      </div>
    </div>
  );
}
