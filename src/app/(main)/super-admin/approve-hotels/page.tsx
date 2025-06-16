
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileCheckIcon, HotelIcon as HotelBuildingIcon, InfoIcon, CheckCircle2Icon, XCircleIcon, EyeIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback } from "react";
import type { Hotel } from "@/lib/types";
import { getHotels, updateHotel, saveHotels } from "@/lib/hotel-data";
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
        fetchPendingHotels(); 
      } else {
        toast({ variant: "destructive", title: "Approval Failed", description: "Could not update hotel status." });
      }
    }
  };

  const handleRejectHotel = (hotelId: string) => {
    const currentHotels = getHotels();
    const hotelToReject = currentHotels.find(h => h.id === hotelId);
    if (hotelToReject) {
        const remainingHotels = currentHotels.filter(h => h.id !== hotelId);
        saveHotels(remainingHotels);
        toast({ title: "Hotel Rejected", description: `Hotel submission for '${hotelToReject.name}' has been removed.` });
        fetchPendingHotels(); 
    } else {
        toast({ variant: "destructive", title: "Rejection Failed", description: "Could not find the hotel to reject."})
    }
  };


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-120px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))]">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center text-white">
          <FileCheckIcon className="mr-3 h-8 w-8 text-primary" /> Approve Hotel Registrations
        </h1>
        <p className="text-gray-300">Review and approve or reject new hotel submissions.</p>
      </div>

      {pendingHotels.length === 0 ? (
        <Alert className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 text-gray-200 shadow-xl">
          <InfoIcon className="h-4 w-4 text-gray-400" />
          <AlertTitle className="text-white font-semibold">No Pending Approvals</AlertTitle>
          <AlertDescription className="text-gray-300">
            There are currently no new hotel registrations awaiting approval.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {pendingHotels.map((hotel) => (
            <Card key={hotel.id} className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl flex items-center text-white">
                      <HotelBuildingIcon className="mr-2 h-5 w-5 text-gray-400" />
                      {hotel.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300">Location: {hotel.location} | Submitted by: {hotel.ownerEmail || 'N/A'}</CardDescription>
                  </div>
                  <Badge variant="outline" className="mt-2 sm:mt-0 bg-yellow-600/30 text-yellow-300 border-yellow-500/70">Pending Approval</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-1">Price per night: ${hotel.pricePerNight}</p>
                <p className="text-sm text-gray-400 mb-4">Rating: {hotel.rating}/5</p>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" onClick={() => handleApproveHotel(hotel.id)} className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle2Icon className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleRejectHotel(hotel.id)}>
                    <XCircleIcon className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button variant="outline" size="sm" asChild className="border-gray-500 text-gray-200 hover:bg-gray-700 hover:border-gray-600">
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
