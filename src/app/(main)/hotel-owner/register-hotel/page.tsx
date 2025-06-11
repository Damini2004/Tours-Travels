
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HotelIcon as HotelBuildingIcon, PlusCircleIcon, UploadIcon, SearchIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import type { FetchHotelDataInput, FetchHotelDataOutput } from "@/ai/flows/fetch-hotel-data-via-serpapi-flow";
// Server Action import
import { fetchHotelDataViaSerpapi } from "@/ai/flows/fetch-hotel-data-via-serpapi-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";


export default function RegisterHotelPage() {
  const [serpApiQuery, setSerpApiQuery] = useState("");
  const [serpApiResults, setSerpApiResults] = useState<FetchHotelDataOutput>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");


  const handleSerpApiSearch = async () => {
    if (!serpApiQuery.trim()) {
      setSearchError("Please enter a hotel name or keyword to search.");
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "Please enter a hotel name or keyword.",
      });
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    setSerpApiResults([]);
    try {
      const input: FetchHotelDataInput = { query: serpApiQuery };
      const results = await fetchHotelDataViaSerpapi(input); 
      setSerpApiResults(results);
      if (results.length === 0) {
        setSearchError("No results found. Try a different search term.");
        toast({
          variant: "default",
          title: "Search Complete",
          description: "No results found. Try a different search term.",
        });
      } else {
        toast({
          title: "Search Successful",
          description: `${results.length} hotel(s) found.`,
        });
      }
    } catch (error) {
      console.error("SerpApi search error:", error);
      setSearchError("Failed to fetch hotel data. Please ensure your SerpApi key is correctly configured.");
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "Could not fetch hotel data. Check your SerpApi key and try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleUseHotelData = (hotelData: FetchHotelDataOutput[0]) => {
    setHotelName(hotelData.title || "");
    setLocation(hotelData.address || "");
    toast({
        title: "Data Applied",
        description: `Details for ${hotelData.title || "selected hotel"} pre-filled.`,
    })
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { hotelName, location, description, amenities, checkInTime, checkOutTime };
    console.log("Form Data:", formData);
    // In a real app, you'd send this to your backend
    toast({
        title: "Hotel Registration Submitted!",
        description: `${hotelName} details have been submitted for review.`,
    });
    // Optionally reset form fields here
    setHotelName("");
    setLocation("");
    setDescription("");
    setAmenities("");
    setCheckInTime("");
    setCheckOutTime("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center">
          <HotelBuildingIcon className="mr-3 h-8 w-8 text-primary" /> Register New Hotel
        </h1>
        <p className="text-muted-foreground">Add your property to Hotel&Tour and start welcoming guests.</p>
      </div>

      <Card className="w-full max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center"><SearchIcon className="mr-2 h-6 w-6" />Auto-fill with SerpApi (Optional)</CardTitle>
          <CardDescription>Search for your hotel to pre-fill some details. Requires a configured SerpApi key.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input 
                id="serpApiQuery" 
                placeholder="e.g., The Grand Hotel, New York" 
                value={serpApiQuery}
                onChange={(e) => setSerpApiQuery(e.target.value)}
              />
              <Button onClick={handleSerpApiSearch} disabled={isSearching}>
                {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
                Search
              </Button>
            </div>
            {searchError && !isSearching && ( // Only show if not actively searching
              <Alert variant="destructive">
                <AlertTitle>Search Error</AlertTitle>
                <AlertDescription>{searchError}</AlertDescription>
              </Alert>
            )}
            {serpApiResults.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium text-muted-foreground">Search Results:</h4>
                <ul className="max-h-48 overflow-y-auto space-y-2 rounded-md border p-2 bg-muted/20">
                  {serpApiResults.map((hotel, index) => (
                    <li key={index} className="p-2 rounded-md hover:bg-muted/50 text-sm">
                      <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{hotel.title}</p>
                            <p className="text-xs text-muted-foreground">{hotel.address}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleUseHotelData(hotel)}>Use</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>


      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center"><PlusCircleIcon className="mr-2 h-6 w-6" />Hotel Details</CardTitle>
          <CardDescription>Provide information about your hotel. You can also search above to auto-fill some fields.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hotelName">Hotel Name</Label>
              <Input id="hotelName" placeholder="e.g., The Grand Palace Hotel" required value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Full Address)</Label>
              <Input id="location" placeholder="e.g., 123 Main St, City, Country" required value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Tell us about your hotel..." required value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma-separated)</Label>
              <Input id="amenities" placeholder="e.g., Free Wi-Fi, Pool, Gym" value={amenities} onChange={(e) => setAmenities(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="checkInTime">Check-in Time</Label>
                    <Input id="checkInTime" type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="checkOutTime">Check-out Time</Label>
                    <Input id="checkOutTime" type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="images">Hotel Images</Label>
                <div className="flex items-center justify-center w-full">
                    <Label 
                        htmlFor="dropzone-file" 
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" multiple />
                    </Label>
                </div> 
            </div>
            <Button type="submit" className="w-full">
              Register Hotel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
