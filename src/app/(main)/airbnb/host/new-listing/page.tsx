
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HomeIcon as PropertyIcon, PlusCircleIcon, UploadIcon, Loader2, BedIcon, UsersIcon, BathIcon, TagIcon, MapPinIcon, ShieldAlertIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { addProperty } from '@/lib/airbnb-data';
import type { Property } from '@/lib/types';
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';

interface CurrentUser {
  fullName: string;
  email: string;
  role: string;
}

const defaultPropertyImage = 'https://placehold.co/600x400.png';
const defaultPropertyHint = 'property placeholder';

export default function NewListingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [location, setLocation] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [guests, setGuests] = useState("1");
  const [bedrooms, setBedrooms] = useState("1");
  const [beds, setBeds] = useState("1");
  const [baths, setBaths] = useState("1");
  const [amenities, setAmenitiesState] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const parsedUser: CurrentUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          if (parsedUser.role === 'hotel_owner') { 
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            toast({ variant: "destructive", title: "Access Denied", description: "You must be a host/hotel owner to list a property." });
          }
        } catch (e) {
          console.error("Failed to parse currentUser", e);
          toast({ variant: "destructive", title: "Error", description: "Could not load user data." });
          router.push("/login?redirect=/airbnb/host/new-listing");
        }
      } else {
        toast({ variant: "destructive", title: "Login Required", description: "Please log in to list a property." });
        router.push("/login?redirect=/airbnb/host/new-listing");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        toast({ variant: "destructive", title: "Unauthorized", description: "You must be logged in." });
        return;
    }
    if (currentUser.role !== 'hotel_owner') {
        toast({ variant: "destructive", title: "Access Denied", description: "Only hosts/hotel owners can list properties." });
        return;
    }
    if (!isAuthorized) {
         toast({ variant: "destructive", title: "Access Denied", description: "You are not authorized to perform this action." });
        return;
    }

    if (!title || !propertyType || !location || !pricePerNight || !guests || !bedrooms || !beds || !baths ) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please fill in all required fields." });
        return;
    }
    setIsLoading(true);

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
      setIsLoading(false);
      return;
    }

    const newPropertyData: Omit<Property, 'id' | 'rating' | 'hostAvatarUrl' | 'isSuperhost'> = {
        title,
        type: propertyType,
        location,
        pricePerNight: parseFloat(pricePerNight) || 0,
        guests: parseInt(guests) || 1,
        bedrooms: parseInt(bedrooms) || 0,
        beds: parseInt(beds) || 0,
        baths: parseInt(baths) || 0,
        amenities: amenities.split(',').map(a => a.trim()).filter(a => a),
        description,
        hostName: currentUser.fullName,
        hostEmail: currentUser.email,
        thumbnailUrl: imageUris.length > 0 ? imageUris[0] : defaultPropertyImage,
        thumbnailHint: imageUris.length > 0 ? "uploaded property" : defaultPropertyHint,
        images: imageUris.length > 0 ? imageUris : [defaultPropertyImage],
        imageHints: imageUris.length > 0 ? imageUris.map(() => "uploaded property") : [defaultPropertyHint],
    };

    try {
      addProperty(newPropertyData);
      toast({
          title: "Property Listed!",
          description: `${title} has been submitted. It will appear in listings shortly.`,
      });
      // Reset form
      setTitle(""); setPropertyType("Apartment"); setLocation(""); setPricePerNight("");
      setGuests("1"); setBedrooms("1"); setBeds("1"); setBaths("1");
      setAmenitiesState(""); setDescription("");
      setImageFiles([]); setImagePreviews([]);
      router.push("/airbnb"); 
    } catch (error) {
      console.error("Error adding property:", error);
      toast({ variant: "destructive", title: "Submission Failed", description: "Could not list your property. Please try again."});
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser && typeof window !== 'undefined' && !localStorage.getItem("currentUser")) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Login Required</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You need to be logged in to list a new property.</p>
                    <Button onClick={() => router.push('/login?redirect=/airbnb/host/new-listing')} className="mt-4 w-full">
                        Log In
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  if (currentUser && !isAuthorized) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive" className="max-w-lg mx-auto">
                <ShieldAlertIcon className="h-5 w-5" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    You must be registered as a Host or Hotel Owner to list properties. Your current role is '{currentUser.role}'.
                    Please contact support if you believe this is an error.
                </AlertDescription>
                <Button onClick={() => router.push('/airbnb')} className="mt-4">Back to Airbnb</Button>
            </Alert>
        </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center justify-center">
          <PropertyIcon className="mr-3 h-8 w-8 text-primary" /> List Your Space
        </h1>
        <p className="text-muted-foreground">Share your property with travelers from around the world.</p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center"><PlusCircleIcon className="mr-2 h-6 w-6" />Property Details</CardTitle>
          <CardDescription>Fill in the information about your space.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input id="title" placeholder="e.g., Cozy Downtown Studio with Great Views" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={!isAuthorized || isLoading} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select value={propertyType} onValueChange={setPropertyType} disabled={!isAuthorized || isLoading}>
                        <SelectTrigger id="propertyType">
                            <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Cabin">Cabin</SelectItem>
                            <SelectItem value="Guest suite">Guest suite</SelectItem>
                            <SelectItem value="Hotel">Hotel</SelectItem>
                            <SelectItem value="Unique stay">Unique stay (e.g., treehouse, yurt)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location (City, Country) *</Label>
                    <div className="relative">
                        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="location" placeholder="e.g., Paris, France" required value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10" disabled={!isAuthorized || isLoading} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pricePerNight">Price Per Night (USD) *</Label>
                    <div className="relative">
                        <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="pricePerNight" type="number" placeholder="e.g., 100" required value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} className="pl-10" min="1" disabled={!isAuthorized || isLoading}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="guests">Max Guests *</Label>
                     <div className="relative">
                        <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="guests" type="number" placeholder="e.g., 2" required value={guests} onChange={(e) => setGuests(e.target.value)} className="pl-10" min="1" disabled={!isAuthorized || isLoading}/>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <div className="relative">
                        <BedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="bedrooms" type="number" placeholder="e.g., 1" required value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="pl-10" min="0" disabled={!isAuthorized || isLoading}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="beds">Beds *</Label>
                     <div className="relative">
                        <BedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="beds" type="number" placeholder="e.g., 1" required value={beds} onChange={(e) => setBeds(e.target.value)} className="pl-10" min="1" disabled={!isAuthorized || isLoading}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="baths">Bathrooms *</Label>
                     <div className="relative">
                        <BathIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="baths" type="number" placeholder="e.g., 1" required value={baths} onChange={(e) => setBaths(e.target.value)} className="pl-10" min="0.5" step="0.5" disabled={!isAuthorized || isLoading}/>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Tell travelers about your space: what makes it unique, the neighborhood, etc." value={description} onChange={(e) => setDescription(e.target.value)} rows={5} disabled={!isAuthorized || isLoading}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma-separated)</Label>
              <Input id="amenities" placeholder="e.g., Wifi, Kitchen, Free parking, Pool" value={amenities} onChange={(e) => setAmenitiesState(e.target.value)} disabled={!isAuthorized || isLoading}/>
            </div>

            <div className="space-y-2">
                <Label htmlFor="images">Property Images</Label>
                <div className="flex items-center justify-center w-full">
                    <Label
                        htmlFor="dropzone-file"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg ${isAuthorized ? 'cursor-pointer bg-card hover:bg-muted/50' : 'cursor-not-allowed bg-muted/30'}`}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon className={`w-8 h-8 mb-2 ${isAuthorized ? 'text-muted-foreground' : 'text-muted-foreground/50'}`} />
                            <p className={`mb-1 text-sm ${isAuthorized ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className={`text-xs ${isAuthorized ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>SVG, PNG, JPG (Max 5MB)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" multiple onChange={handleImageChange} disabled={!isAuthorized || isLoading} accept="image/*" />
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

            <Button type="submit" className="w-full" disabled={!isAuthorized || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircleIcon className="mr-2 h-4 w-4" />}
              {isLoading ? "Submitting..." : "List My Space"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
