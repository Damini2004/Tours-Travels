
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HotelIcon as HotelBuildingIcon, PlusCircleIcon, ListIcon, EditIcon, TrashIcon, Loader2, KeyRoundIcon, Gem } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Hotel, UltraLuxPackage } from '@/lib/types';
import { getHotels, addHotel, saveHotels, addUltraLuxPackage, getUltraLuxPackages } from '@/lib/hotel-data';
import Link from "next/link";
import { useRouter } from "next/navigation"; 

interface User {
  fullName: string;
  email: string;
  role: string;
  password?: string; 
}

const defaultHotelImage = 'https://media.istockphoto.com/id/1197480605/photo/3d-render-of-luxury-hotel-lobby-and-reception.jpg?s=612x612&w=0&k=20&c=h2DMumrFFZDGqPypcK4Whx8mM1EdCKWh8PLY2saLIzo=';
const defaultHotelHint = 'hotel lobby';

export default function ManagePlatformHotelsPage() {
  const { toast } = useToast();
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);

  // State for Regular Hotels
  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenitiesState] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [rating, setRatingState] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(defaultHotelImage);
  const [thumbnailHint, setThumbnailHint] = useState(defaultHotelHint);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);

  // State for Ultra Lux Packages
  const [luxTitle, setLuxTitle] = useState("");
  const [luxLocation, setLuxLocation] = useState("");
  const [luxBrand, setLuxBrand] = useState("");
  const [luxImageUrl, setLuxImageUrl] = useState("");
  const [luxImageHint, setLuxImageHint] = useState("");
  const [luxNights, setLuxNights] = useState("");
  const [luxPrice, setLuxPrice] = useState("");
  const [luxOriginalPrice, setLuxOriginalPrice] = useState("");
  const [allUltraLux, setAllUltraLux] = useState<UltraLuxPackage[]>([]);


  const fetchAllData = useCallback(() => {
    setIsLoading(true);
    setAllHotels(getHotels());
    setAllUltraLux(getUltraLuxPackages());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAddHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!hotelName || !location || !pricePerNight || !rating || !ownerEmail || !ownerPassword) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please fill all required fields including owner's email and password." });
        return;
    }

    if (typeof window !== "undefined") {
        let usersDB: User[] = [];
        const existingUsersString = localStorage.getItem("usersDB");
        if (existingUsersString) {
            try {
                usersDB = JSON.parse(existingUsersString);
            } catch (err) { console.warn("Error parsing usersDB from localStorage", err); }
        }
        const ownerExists = usersDB.some(user => user.email === ownerEmail.trim());
        if (!ownerExists) {
            const newOwner: User = {
                fullName: "Hotel Owner", 
                email: ownerEmail.trim(),
                role: "hotel_owner",
                password: ownerPassword,
            };
            usersDB.push(newOwner);
            localStorage.setItem("usersDB", JSON.stringify(usersDB));
            toast({ title: "Hotel Owner Created", description: `New owner account for ${ownerEmail} created.`});
        }
    }
    
    const currentThumbnailUrl = thumbnailUrl && thumbnailUrl.trim() !== "" ? thumbnailUrl : defaultHotelImage;
    const currentImageUrls = [thumbnailUrl && thumbnailUrl.trim() !== "" ? thumbnailUrl : defaultHotelImage];
    const isCustomImage = currentThumbnailUrl !== defaultHotelImage;

    const newHotelData: Omit<Hotel, 'id'> = {
      name: hotelName,
      location,
      description,
      amenities: amenities.split(',').map(a => a.trim()).filter(a => a),
      pricePerNight: parseFloat(pricePerNight) || 0,
      rating: parseInt(rating) || 0,
      ownerEmail: ownerEmail.trim(),
      isApproved: true, 
      thumbnailUrl: currentThumbnailUrl,
      thumbnailHint: isCustomImage ? "hotel building" : defaultHotelHint,
      images: currentImageUrls,
      imageHints: [isCustomImage ? "hotel main view" : defaultHotelHint],
      checkInTime: "15:00", 
      checkOutTime: "11:00", 
    };

    addHotel(newHotelData);
    toast({
      title: "Hotel Added!",
      description: `${hotelName} has been added to the platform and is live.`,
    });
    setHotelName(""); setLocation(""); setDescription(""); setAmenitiesState("");
    setPricePerNight(""); setRatingState(""); setOwnerEmail(""); setOwnerPassword("");
    setThumbnailUrl(defaultHotelImage); setThumbnailHint(defaultHotelHint);
    fetchAllData(); 
  };
  
  const handleAddUltraLuxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!luxTitle || !luxLocation || !luxBrand || !luxImageUrl || !luxNights || !luxPrice || !luxOriginalPrice) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please fill all required fields for the Ultra Lux package." });
        return;
    }
    
    const newPackage: Omit<UltraLuxPackage, 'id'> = {
        title: luxTitle,
        location: luxLocation,
        brand: luxBrand,
        imageUrl: luxImageUrl,
        imageHint: luxImageHint || 'luxury travel',
        nights: parseInt(luxNights),
        price: parseFloat(luxPrice),
        originalPrice: parseFloat(luxOriginalPrice),
    };

    addUltraLuxPackage(newPackage);
    toast({ title: "Ultra Lux Package Added!", description: `${luxTitle} is now live.` });
    setLuxTitle(""); setLuxLocation(""); setLuxBrand(""); setLuxImageUrl(""); setLuxImageHint("");
    setLuxNights(""); setLuxPrice(""); setLuxOriginalPrice("");
    fetchAllData();
  };

  const handleDeleteHotel = (hotelId: string) => {
    const currentHotels = getHotels();
    const hotelToDelete = currentHotels.find(h => h.id === hotelId);
    if (hotelToDelete) {
        const updatedHotels = currentHotels.filter(h => h.id !== hotelId);
        saveHotels(updatedHotels);
        toast({ title: "Hotel Deleted", description: `${hotelToDelete.name} has been removed.` });
        fetchAllData();
    } else {
        toast({ variant: "destructive", title: "Deletion Failed", description: "Could not find the hotel to delete." });
    }
  };

  useEffect(() => {
    const isCustom = thumbnailUrl && thumbnailUrl.trim() !== "" && thumbnailUrl !== defaultHotelImage;
    setThumbnailHint(isCustom ? "hotel building" : defaultHotelHint);
  }, [thumbnailUrl]);


  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))]">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center text-white">
          <HotelBuildingIcon className="mr-3 h-8 w-8 text-sky-400" /> Manage Platform Listings
        </h1>
        <p className="text-gray-300">Add, view, and manage regular hotels and Ultra Lux packages.</p>
      </div>

      {/* Add Ultra Lux Package Form */}
       <Card className="w-full max-w-3xl mx-auto mb-12 bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-white text-xl font-semibold"><Gem className="mr-2 h-6 w-6 text-sky-400" />Add New Ultra Lux Package</CardTitle>
          <CardDescription className="text-gray-300">Add a new exclusive Ultra Lux package to the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddUltraLuxSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Title *</Label>
                <Input placeholder="Oceanfront Bali Hideaway..." required value={luxTitle} onChange={(e) => setLuxTitle(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Brand *</Label>
                <Input placeholder="SOORI BALI" required value={luxBrand} onChange={(e) => setLuxBrand(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
              </div>
            </div>
            <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Location *</Label>
                <Input placeholder="Tabanan, Bali" required value={luxLocation} onChange={(e) => setLuxLocation(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Image URL *</Label>
                <Input type="url" placeholder="https://example.com/image.jpg" required value={luxImageUrl} onChange={(e) => setLuxImageUrl(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
              </div>
               <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Image Hint</Label>
                <Input placeholder="luxury resort bali" value={luxImageHint} onChange={(e) => setLuxImageHint(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Nights *</Label>
                <Input type="number" placeholder="2" required value={luxNights} onChange={(e) => setLuxNights(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Price (INR) *</Label>
                <Input type="number" placeholder="296939" required value={luxPrice} onChange={(e) => setLuxPrice(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
              </div>
               <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Original Price (INR) *</Label>
                <Input type="number" placeholder="337888" required value={luxOriginalPrice} onChange={(e) => setLuxOriginalPrice(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white mt-4">Add Ultra Lux Package</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl mx-auto mb-12 bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-white text-xl font-semibold"><PlusCircleIcon className="mr-2 h-6 w-6 text-sky-400" />Add New Hotel (Super Admin)</CardTitle>
          <CardDescription className="text-gray-300">Hotels added here are automatically approved. If owner email is new, an owner account will be created.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddHotelSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="saHotelName" className="text-gray-300">Hotel Name *</Label>
                    <Input id="saHotelName" placeholder="Luxury Palace" required value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="saLocation" className="text-gray-300">Location (Full Address) *</Label>
                    <Input id="saLocation" placeholder="1 Royal Way, City, Country" required value={location} onChange={(e) => setLocation(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="saPricePerNight" className="text-gray-300">Price Per Night (USD) *</Label>
                    <Input id="saPricePerNight" type="number" placeholder="200" required value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="saRating" className="text-gray-300">Rating (1-5) *</Label>
                    <Input id="saRating" type="number" placeholder="5" min="1" max="5" required value={rating} onChange={(e) => setRatingState(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="saOwnerEmail" className="flex items-center text-gray-300"><KeyRoundIcon className="mr-1.5 h-4 w-4 text-gray-400"/>Owner's Email *</Label>
                    <Input id="saOwnerEmail" type="email" placeholder="owner@example.com" required value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="saOwnerPassword" className="text-gray-300">Owner's Password *</Label>
                    <Input id="saOwnerPassword" type="password" placeholder="Set a password for the owner" required value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="saDescription" className="text-gray-300">Description</Label>
              <Textarea id="saDescription" placeholder="A brief description of the hotel..." value={description} onChange={(e) => setDescription(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saAmenities" className="text-gray-300">Amenities (comma-separated)</Label>
              <Input id="saAmenities" placeholder="Pool, Gym, Spa" value={amenities} onChange={(e) => setAmenitiesState(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="saThumbnailUrl" className="text-gray-300">Thumbnail URL (leave for default placeholder)</Label>
                <Input id="saThumbnailUrl" placeholder={defaultHotelImage} value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
                {thumbnailUrl && (
                    <div className="mt-2">
                        <img src={thumbnailUrl} alt="Thumbnail Preview" className="h-20 w-auto rounded-md border border-slate-600" 
                             onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400.png/CCCCCC/FFFFFF?text=Invalid+URL"; }} 
                        />
                    </div>
                )}
            </div>
            <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white">
              Add Hotel to Platform
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-xl">
        <CardHeader>
            <CardTitle className="flex items-center text-white text-xl font-semibold"><ListIcon className="mr-2 h-6 w-6 text-sky-400" />All Listed Hotels</CardTitle>
            <CardDescription className="text-gray-300">Total hotels on platform: {allHotels.length}. Approved: {allHotels.filter(h=>h.isApproved).length}. Pending: {allHotels.filter(h=>!h.isApproved).length}</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                 <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-sky-400" /></div>
            ) : allHotels.length === 0 ? (
                <p className="text-gray-400">No hotels found on the platform yet.</p>
            ) : (
                <div className="space-y-3">
                    {allHotels.map(hotel => (
                        <div key={hotel.id} className="p-3 border border-slate-700 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-700/50 transition-colors">
                            <div className="flex-grow">
                                <h3 className="font-semibold text-base text-gray-100">{hotel.name} 
                                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${hotel.isApproved ? 'bg-green-600/30 text-green-300 border border-green-500/70' : 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/70'}`}>
                                        {hotel.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </h3>
                                <p className="text-xs text-gray-400">{hotel.location}</p>
                                <p className="text-xs text-gray-400">Owner: {hotel.ownerEmail || 'N/A'}</p>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0 flex-shrink-0">
                                <Button variant="outline" size="sm" asChild className="bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 hover:text-slate-900">
                                    <Link href={`/hotels/${hotel.id}`} target="_blank"><EditIcon className="mr-1 h-3 w-3"/>View/Edit</Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteHotel(hotel.id)}>
                                    <TrashIcon className="mr-1 h-3 w-3"/>Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
