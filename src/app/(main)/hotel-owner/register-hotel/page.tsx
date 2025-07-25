
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HotelIcon as HotelBuildingIcon, PlusCircleIcon, UploadIcon, SearchIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { FetchHotelDataInput, FetchHotelDataOutput } from "@/ai/flows/fetch-hotel-data-via-serpapi-flow";
import { fetchHotelDataViaSerpapi } from "@/ai/flows/fetch-hotel-data-via-serpapi-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { addHotel } from '@/lib/hotel-data';
import type { Hotel } from '@/lib/types';
import Image from 'next/image';

interface CurrentUser {
  fullName: string;
  email: string;
  role: string;
}

const defaultHotelImage = 'https://media.istockphoto.com/id/1197480605/photo/3d-render-of-luxury-hotel-lobby-and-reception.jpg?s=612x612&w=0&k=20&c=h2DMumrFFZDGqPypcK4Whx8mM1EdCKWh8PLY2saLIzo=';
const defaultHotelHint = 'hotel lobby';

export default function RegisterHotelPage() {
  const [serpApiQuery, setSerpApiQuery] = useState("");
  const [serpApiResults, setSerpApiResults] = useState<FetchHotelDataOutput>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { toast } = useToast();

  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenitiesState] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [rating, setRating] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse currentUser", e);
        }
      }
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };

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
    setRating(hotelData.rating ? String(hotelData.rating) : "");
    toast({
        title: "Data Applied",
        description: `Details for ${hotelData.title || "selected hotel"} pre-filled. Please complete other fields.`,
    })
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'hotel_owner') {
        toast({ variant: "destructive", title: "Unauthorized", description: "You must be logged in as a hotel owner." });
        return;
    }
    if (!hotelName || !location || !pricePerNight || !rating) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please fill in all required fields (Name, Location, Price, Rating)." });
        return;
    }
    setIsSubmitting(true);

    const fileToDataUri = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    let imageUris: string[] = [];
    try {
      imageUris = await Promise.all(imageFiles.map(file => fileToDataUri(file)));
    } catch (error) {
      console.error("Error converting images to data URIs", error);
      toast({ variant: "destructive", title: "Image Error", description: "Could not process uploaded images." });
      setIsSubmitting(false);
      return;
    }

    const newHotelData: Omit<Hotel, 'id' | 'isApproved'> = {
        name: hotelName,
        location,
        description,
        amenities: amenities.split(',').map(a => a.trim()).filter(a => a),
        checkInTime,
        checkOutTime,
        pricePerNight: parseFloat(pricePerNight) || 0,
        rating: parseInt(rating) || 0,
        ownerEmail: currentUser.email,
        thumbnailUrl: imageUris.length > 0 ? imageUris[0] : defaultHotelImage, 
        thumbnailHint: imageUris.length > 0 ? 'uploaded hotel' : defaultHotelHint,
        images: imageUris.length > 0 ? imageUris : [defaultHotelImage],
        imageHints: imageUris.length > 0 ? imageUris.map(() => 'uploaded hotel') : [defaultHotelHint],
    };

    addHotel({ ...newHotelData, isApproved: false }); 

    toast({
        title: "Hotel Submitted!",
        description: `${hotelName} has been submitted for approval. You can find it under 'My Hotels'.`,
    });
    setHotelName("");
    setLocation("");
    setDescription("");
    setAmenitiesState("");
    setCheckInTime("");
    setCheckOutTime("");
    setPricePerNight("");
    setRating("");
    setSerpApiQuery("");
    setSerpApiResults([]);
    setImageFiles([]);
    setImagePreviews([]);
    setIsSubmitting(false);
  };

  if (!currentUser && typeof window !== 'undefined') { 
    return (
        <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>You need to be logged in as a Hotel Owner to register a hotel.</AlertDescription>
            </Alert>
        </div>
    )
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center">
          <HotelBuildingIcon className="mr-3 h-8 w-8 text-[#0c4d52]" /> Register New Hotel
        </h1>
        <p className="text-muted-foreground">Add your property and submit it for approval.</p>
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
            {searchError && !isSearching && ( 
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>


      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center"><PlusCircleIcon className="mr-2 h-6 w-6" />Hotel Details</CardTitle>
          <CardDescription>Provide information about your hotel. Hotels will be reviewed before appearing publicly.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hotelName">Hotel Name *</Label>
              <Input id="hotelName" placeholder="e.g., The Grand Palace Hotel" required value={hotelName} onChange={(e) => setHotelName(e.target.value)} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Full Address) *</Label>
              <Input id="location" placeholder="e.g., 123 Main St, City, Country" required value={location} onChange={(e) => setLocation(e.target.value)} disabled={isSubmitting} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pricePerNight">Price Per Night (USD) *</Label>
                    <Input id="pricePerNight" type="number" placeholder="e.g., 150" required value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} disabled={isSubmitting} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5) *</Label>
                    <Input id="rating" type="number" placeholder="e.g., 4" min="1" max="5" required value={rating} onChange={(e) => setRating(e.target.value)} disabled={isSubmitting} />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Tell us about your hotel..." value={description} onChange={(e) => setDescription(e.target.value)} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma-separated)</Label>
              <Input id="amenities" placeholder="e.g., Free Wi-Fi, Pool, Gym" value={amenities} onChange={(e) => setAmenitiesState(e.target.value)} disabled={isSubmitting} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="checkInTime">Check-in Time</Label>
                    <Input id="checkInTime" type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} disabled={isSubmitting} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="checkOutTime">Check-out Time</Label>
                    <Input id="checkOutTime" type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} disabled={isSubmitting} />
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
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF (Max 5MB)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" multiple onChange={handleImageChange} disabled={isSubmitting} accept="image/*"/>
                    </Label>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image src={preview} alt={`Preview ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" />
                      </div>
                    ))}
                  </div>
                )}
                 <p className="text-xs text-muted-foreground mt-1">
                   {imageFiles.length === 0 ? "If no images are uploaded, a default placeholder will be used." : `${imageFiles.length} image(s) selected.`}
                 </p>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
