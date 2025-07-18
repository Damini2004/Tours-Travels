
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HotelIcon as HotelBuildingIcon, PlusCircleIcon, ListIcon, EditIcon, TrashIcon, Loader2, KeyRoundIcon, Gem, UploadIcon, VideoIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Hotel, UltraLuxPackage } from '@/lib/types';
import { getHotels, addHotel, saveHotels, addUltraLuxPackage, getUltraLuxPackages, deleteUltraLuxPackage } from '@/lib/hotel-data';
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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
  const [luxImageFile1, setLuxImageFile1] = useState<File | null>(null);
  const [luxImagePreview1, setLuxImagePreview1] = useState<string | null>(null);
  const [luxImageHint1, setLuxImageHint1] = useState("");
  const [luxImageFile2, setLuxImageFile2] = useState<File | null>(null);
  const [luxImagePreview2, setLuxImagePreview2] = useState<string | null>(null);
  const [luxImageHint2, setLuxImageHint2] = useState("");
  const [luxVideoUrl, setLuxVideoUrl] = useState("");
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

  const handleLuxImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      if (imageNumber === 1) {
        setLuxImageFile1(file);
        if (luxImagePreview1) URL.revokeObjectURL(luxImagePreview1);
        setLuxImagePreview1(previewUrl);
      } else {
        setLuxImageFile2(file);
        if (luxImagePreview2) URL.revokeObjectURL(luxImagePreview2);
        setLuxImagePreview2(previewUrl);
      }
    }
  };

  const fileToDataUri = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

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
  
  const handleAddUltraLuxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!luxTitle || !luxLocation || !luxBrand || !luxImageFile1 || !luxImageFile2 || !luxNights || !luxPrice || !luxOriginalPrice) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please fill all required fields for the Ultra Lux package, including two images." });
        return;
    }
    
    let imageUrls: string[] = [];
    try {
        const [url1, url2] = await Promise.all([
            fileToDataUri(luxImageFile1),
            fileToDataUri(luxImageFile2),
        ]);
        imageUrls.push(url1, url2);
    } catch (error) {
        toast({ variant: "destructive", title: "Image Error", description: "Could not process image files." });
        return;
    }

    const newPackage: Omit<UltraLuxPackage, 'id'> = {
        title: luxTitle,
        location: luxLocation,
        brand: luxBrand,
        imageUrls: imageUrls,
        imageHints: [luxImageHint1 || 'luxury travel', luxImageHint2 || 'resort interior'],
        videoUrl: luxVideoUrl,
        nights: parseInt(luxNights),
        price: parseFloat(luxPrice),
        originalPrice: parseFloat(luxOriginalPrice),
    };

    addUltraLuxPackage(newPackage);
    toast({ title: "Ultra Lux Package Added!", description: `${luxTitle} is now live.` });
    setLuxTitle(""); setLuxLocation(""); setLuxBrand(""); 
    setLuxImageFile1(null); setLuxImagePreview1(null); setLuxImageHint1("");
    setLuxImageFile2(null); setLuxImagePreview2(null); setLuxImageHint2("");
    setLuxVideoUrl("");
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

  const handleDeleteUltraLuxPackage = (packageId: string) => {
    const deletedPackage = deleteUltraLuxPackage(packageId);
    if (deletedPackage) {
        toast({ title: "Package Deleted", description: `${deletedPackage.title} has been removed.` });
        fetchAllData();
    } else {
        toast({ variant: "destructive", title: "Deletion Failed", description: "Could not find the package to delete." });
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
      
      <Tabs defaultValue="ultra-lux" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 p-1 rounded-md border border-slate-700 mb-6">
            <TabsTrigger value="ultra-lux" className="text-gray-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-md py-2">
                <Gem className="mr-2 h-4 w-4" /> Ultra Lux Packages
            </TabsTrigger>
            <TabsTrigger value="regular-hotels" className="text-gray-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=active]:shadow-md py-2">
                <HotelBuildingIcon className="mr-2 h-4 w-4" /> Regular Hotels
            </TabsTrigger>
        </TabsList>

        <TabsContent value="ultra-lux">
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-white text-2xl font-bold"><Gem className="mr-3 h-7 w-7 text-sky-400" />Ultra Lux Packages</CardTitle>
                  <CardDescription className="text-gray-300">Manage exclusive, high-end travel packages.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="add-ultra-lux" className="border-b-0">
                        <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline rounded-md px-4 hover:bg-slate-700/50">
                            <div className="flex items-center gap-2"><PlusCircleIcon className="h-5 w-5"/> Add New Ultra Lux Package</div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                            <form onSubmit={handleAddUltraLuxSubmit} className="space-y-4 p-4 border border-slate-700 rounded-b-md bg-slate-800">
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
                                  {/* Image 1 Upload */}
                                  <div className="space-y-2">
                                      <Label className="text-gray-300 text-xs">Image 1 *</Label>
                                      <Label htmlFor="lux-image-upload-1" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700/50 hover:bg-slate-700/80">
                                          {luxImagePreview1 ? 
                                            <Image src={luxImagePreview1} alt="Preview 1" layout="fill" objectFit="cover" className="rounded-lg" /> :
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                              <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                                              <p className="text-xs text-gray-400">Main Image</p>
                                            </div>
                                          }
                                          <Input id="lux-image-upload-1" type="file" className="hidden" accept="image/*" onChange={(e) => handleLuxImageChange(e, 1)} />
                                      </Label>
                                      <Input placeholder="Image 1 hint (e.g., luxury resort)" value={luxImageHint1} onChange={(e) => setLuxImageHint1(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400 text-xs h-8" />
                                  </div>
                                  {/* Image 2 Upload */}
                                  <div className="space-y-2">
                                      <Label className="text-gray-300 text-xs">Image 2 *</Label>
                                      <Label htmlFor="lux-image-upload-2" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700/50 hover:bg-slate-700/80">
                                          {luxImagePreview2 ? 
                                            <Image src={luxImagePreview2} alt="Preview 2" layout="fill" objectFit="cover" className="rounded-lg" /> :
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                                                <p className="text-xs text-gray-400">Secondary Image</p>
                                            </div>
                                          }
                                          <Input id="lux-image-upload-2" type="file" className="hidden" accept="image/*" onChange={(e) => handleLuxImageChange(e, 2)} />
                                      </Label>
                                      <Input placeholder="Image 2 hint (e.g., resort pool)" value={luxImageHint2} onChange={(e) => setLuxImageHint2(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400 text-xs h-8" />
                                  </div>
                              </div>
                              <div className="space-y-1">
                                  <Label className="text-gray-300 text-xs flex items-center gap-1.5"><VideoIcon className="h-4 w-4"/>Video URL (Optional)</Label>
                                  <Input type="url" placeholder="https://example.com/video.mp4" value={luxVideoUrl} onChange={(e) => setLuxVideoUrl(e.target.value)} className="bg-slate-700/50 border-slate-600 text-gray-100 placeholder:text-gray-400 focus:bg-slate-700 focus:border-sky-400" />
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
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Separator className="my-4 bg-slate-700" />
                    <h4 className="text-lg font-semibold text-white flex items-center mb-4"><ListIcon className="mr-2 h-5 w-5"/>All Ultra Lux Packages ({allUltraLux.length})</h4>
                     {isLoading ? (
                        <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-sky-400" /></div>
                    ) : allUltraLux.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No Ultra Lux packages found.</p>
                    ) : (
                        <div className="space-y-3">
                            {allUltraLux.map(pkg => (
                                <div key={pkg.id} className="p-3 border border-slate-700 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-700/50 transition-colors">
                                    <div className="flex items-center gap-4 flex-grow">
                                        <Image src={pkg.imageUrls?.[0] || 'https://placehold.co/80x60.png/27272a/FFFFFF?text=No+Image'} alt={pkg.title} width={80} height={60} className="rounded-md object-cover" />
                                        <div>
                                            <h3 className="font-semibold text-base text-gray-100">{pkg.title}</h3>
                                            <p className="text-xs text-gray-400">{pkg.brand} - {pkg.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2 sm:mt-0 flex-shrink-0">
                                        <Button variant="outline" size="sm" disabled className="bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 hover:text-slate-900 opacity-50">
                                            <EditIcon className="mr-1 h-3 w-3"/>Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUltraLuxPackage(pkg.id)}>
                                            <TrashIcon className="mr-1 h-3 w-3"/>Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="regular-hotels">
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-white text-2xl font-bold"><HotelBuildingIcon className="mr-3 h-7 w-7 text-sky-400" />Regular Hotels</CardTitle>
                  <CardDescription className="text-gray-300">Manage standard hotel listings on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="add-regular-hotel" className="border-b-0">
                         <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline rounded-md px-4 hover:bg-slate-700/50">
                            <div className="flex items-center gap-2"><PlusCircleIcon className="h-5 w-5"/> Add New Hotel</div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                            <form onSubmit={handleAddHotelSubmit} className="space-y-6 p-4 border border-slate-700 rounded-b-md bg-slate-800">
                               <p className="text-sm text-gray-400">Hotels added here are automatically approved. If the owner's email is new, an owner account will be created.</p>
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
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Separator className="my-4 bg-slate-700" />
                    <h4 className="text-lg font-semibold text-white flex items-center mb-4"><ListIcon className="mr-2 h-5 w-5"/>All Listed Hotels ({allHotels.length})</h4>
                     {isLoading ? (
                        <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-sky-400" /></div>
                    ) : allHotels.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No hotels found on the platform yet.</p>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
