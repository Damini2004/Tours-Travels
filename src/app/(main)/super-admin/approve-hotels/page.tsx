
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileCheckIcon, HotelIcon as HotelBuildingIcon, SearchIcon, CheckCircle2Icon, XCircleIcon, EyeIcon, InfoIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback } from "react";
import type { Hotel } from "@/lib/types";
import { getHotels, updateHotel } from "@/lib/hotel-data";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function ApproveHotelsPage() {
  const [pendingHotels, setPendingHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPendingHotels = useCallback(() => {
    setIsLoading(true);
    const allHotels = getHotels();
    setPendingHotels(allHotels.filter(hotel => !hotel.isApproved));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPendingHotels();
  }, [fetchPendingHotels]);

  const handleApproveHotel = (hotelId: string) => {
    const hotelToApprove = pendingHotels.find(h => h.id === hotelId);
    if (hotelToApprove) {
      const updated = updateHotel({ ...hotelToApprove, isApproved: true });
      if (updated) {
        toast({ title: "Hotel Approved", description: `${updated.name} is now live.` });
        fetchPendingHotels(); // Refresh list
      } else {
        toast({ variant: "destructive", title: "Approval Failed", description: "Could not update hotel status." });
      }
    }
  };

  const handleRejectHotel = (hotelId: string) => {
    // For now, rejection could mean deleting it or marking it as rejected.
    // Simple deletion for this prototype:
    const currentHotels = getHotels();
    const hotelToReject = currentHotels.find(h => h.id === hotelId);
    if (hotelToReject) {
        const remainingHotels = currentHotels.filter(h => h.id !== hotelId);
        localStorage.setItem('appHotelsDB', JSON.stringify(remainingHotels));
        toast({ title: "Hotel Rejected", description: `Hotel submission for '${hotelToReject.name}' has been removed.` });
        fetchPendingHotels(); 
    } else {
        toast({ variant: "destructive", title: "Rejection Failed", description: "Could not find the hotel to reject."})
    }
  };


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center text-foreground">
          <FileCheckIcon className="mr-3 h-8 w-8 text-primary" /> Approve Hotel Registrations
        </h1>
        <p className="text-muted-foreground">Review and approve or reject new hotel submissions.</p>
      </div>

      {pendingHotels.length === 0 ? (
        <Alert className="bg-card text-card-foreground">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>No Pending Approvals</AlertTitle>
          <AlertDescription>
            There are currently no new hotel registrations awaiting approval.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {pendingHotels.map((hotel) => (
            <Card key={hotel.id} className="bg-card text-card-foreground">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl flex items-center">
                      <HotelBuildingIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                      {hotel.name}
                    </CardTitle>
                    <CardDescription>Location: {hotel.location} | Submitted by: {hotel.ownerEmail || 'N/A'}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="mt-2 sm:mt-0 bg-yellow-100 text-yellow-800 border-yellow-300">Pending Approval</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">Price per night: ${hotel.pricePerNight}</p>
                <p className="text-sm text-muted-foreground mb-4">Rating: {hotel.rating}/5</p>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" onClick={() => handleApproveHotel(hotel.id)} className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle2Icon className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleRejectHotel(hotel.id)}>
                    <XCircleIcon className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/hotels/${hotel.id}`} target="_blank"> 
                       <EyeIcon className="mr-2 h-4 w-4" /> View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
