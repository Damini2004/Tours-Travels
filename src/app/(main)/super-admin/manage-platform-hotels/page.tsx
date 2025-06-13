
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HotelIcon as HotelBuildingIcon, PlusCircleIcon, ListIcon, EditIcon, TrashIcon, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Hotel } from '@/lib/types';
import { getHotels, addHotel, saveHotels } from '@/lib/hotel-data';
import Link from "next/link";

export default function ManagePlatformHotelsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form state for adding a new hotel
  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenitiesState] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [rating, setRatingState] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://placehold.co/600x400.png"); // Default placeholder

  const [allHotels, setAllHotels] = useState<Hotel[]>([]);

  const fetchAllHotels = useCallback(() => {
    setIsLoading(true);
    setAllHotels(getHotels());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAllHotels();
  }, [fetchAllHotels]);

  const handleAddHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!hotelName || !location || !pricePerNight || !rating || !ownerEmail) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please fill all required fields for the new hotel." });
        return;
    }
    const newHotelData: Omit<Hotel, 'id'> = {
      name: hotelName,
      location,
      description,
      amenities: amenities.split(',').map(a => a.trim()).filter(a => a),
      pricePerNight: parseFloat(pricePerNight) || 0,
      rating: parseInt(rating) || 0,
      ownerEmail: ownerEmail.trim(),
      isApproved: true, // Hotels added by Super Admin are auto-approved
      thumbnailUrl: thumbnailUrl || 'https://placehold.co/600x400.png',
      thumbnailHint: 'hotel exterior',
      images: [thumbnailUrl || 'https://placehold.co/1200x800.png'],
      imageHints: ['hotel room'],
      checkInTime: "15:00", // Default
      checkOutTime: "11:00", // Default
    };

    addHotel(newHotelData);
    toast({
      title: "Hotel Added!",
      description: `${hotelName} has been added to the platform and is live.`,
    });
    // Reset form
    setHotelName("");
    setLocation("");
    setDescription("");
    setAmenitiesState("");
    setPricePerNight("");
    setRatingState("");
    setOwnerEmail("");
    setThumbnailUrl("https://placehold.co/600x400.png");
    fetchAllHotels(); // Refresh list
  };

  const handleDeleteHotel = (hotelId: string) => {
    const currentHotels = getHotels();
    const updatedHotels = currentHotels.filter(h => h.id !== hotelId);
    saveHotels(updatedHotels);
    toast({ title: "Hotel Deleted", description: `Hotel (ID: ${hotelId}) has been removed.` });
    fetchAllHotels();
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center">
          <HotelBuildingIcon className="mr-3 h-8 w-8 text-primary" /> Manage Platform Hotels
        </h1>
        <p className="text-muted-foreground">Add new hotels, view, and manage existing hotel listings.</p>
      </div>

      <Card className="w-full max-w-3xl mx-auto mb-12">
        <CardHeader>
          <CardTitle className="flex items-center"><PlusCircleIcon className="mr-2 h-6 w-6" />Add New Hotel (Super Admin)</CardTitle>
          <CardDescription>Hotels added here are automatically approved and live.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddHotelSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="saHotelName">Hotel Name *</Label>
                    <Input id="saHotelName" placeholder="Luxury Palace" required value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="saLocation">Location (Full Address) *</Label>
                    <Input id="saLocation" placeholder="1 Royal Way, City, Country" required value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="saPricePerNight">Price Per Night (USD) *</Label>
                    <Input id="saPricePerNight" type="number" placeholder="200" required value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="saRating">Rating (1-5) *</Label>
                    <Input id="saRating" type="number" placeholder="5" min="1" max="5" required value={rating} onChange={(e) => setRatingState(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="saOwnerEmail">Owner's Email *</Label>
                    <Input id="saOwnerEmail" type="email" placeholder="owner@example.com" required value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="saDescription">Description</Label>
              <Textarea id="saDescription" placeholder="A brief description of the hotel..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saAmenities">Amenities (comma-separated)</Label>
              <Input id="saAmenities" placeholder="Pool, Gym, Spa" value={amenities} onChange={(e) => setAmenitiesState(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="saThumbnailUrl">Thumbnail URL</Label>
                <Input id="saThumbnailUrl" placeholder="https://example.com/image.png" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
              Add Hotel to Platform
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center"><ListIcon className="mr-2 h-6 w-6" />All Listed Hotels</CardTitle>
            <CardDescription>Total hotels on platform: {allHotels.length}. Approved: {allHotels.filter(h=>h.isApproved).length}. Pending: {allHotels.filter(h=>!h.isApproved).length}</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                 <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : allHotels.length === 0 ? (
                <p className="text-muted-foreground">No hotels found on the platform yet.</p>
            ) : (
                <div className="space-y-4">
                    {allHotels.map(hotel => (
                        <div key={hotel.id} className="p-3 border rounded-md flex justify-between items-center hover:bg-muted/50">
                            <div>
                                <h3 className="font-semibold">{hotel.name} <span className={`text-xs px-1.5 py-0.5 rounded-full ${hotel.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{hotel.isApproved ? 'Approved' : 'Pending'}</span></h3>
                                <p className="text-xs text-muted-foreground">{hotel.location} | Owner: {hotel.ownerEmail || 'N/A'}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
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
