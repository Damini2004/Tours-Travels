
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListChecksIcon, HotelIcon as HotelBuildingIcon, PlusCircleIcon, EditIcon } from "lucide-react";

// Placeholder data - in a real app, fetch from backend
const ownerHotels = [
  { id: "myht001", name: "My Seaside Inn", location: "Coastal Town, CT", status: "Published", rooms: 15 },
  { id: "myht002", name: "Downtown Boutique Hotel", location: "Big City, BC", status: "Draft", rooms: 8 },
];

export default function MyHotelsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center">
            <ListChecksIcon className="mr-3 h-8 w-8 text-primary" /> My Hotels
          </h1>
          <p className="text-muted-foreground">Manage your listed properties, rooms, and availability.</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/hotel-owner/register-hotel">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Hotel
          </Link>
        </Button>
      </div>

      {ownerHotels.length === 0 ? (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center"><HotelBuildingIcon className="mr-2 h-6 w-6 text-muted-foreground" />No Hotels Listed Yet</CardTitle>
            <CardDescription>
              You haven&apos;t registered any hotels yet. Add your first property to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
             <Alert variant="default" className="bg-card mb-6">
                <HotelBuildingIcon className="h-4 w-4" />
                <AlertTitle>Ready to list your property?</AlertTitle>
                <AlertDescription>
                    Click the button below to add your first hotel.
                </AlertDescription>
            </Alert>
            <Button asChild size="lg">
              <Link href="/hotel-owner/register-hotel">Register Your First Hotel</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {ownerHotels.map((hotel) => (
            <Card key={hotel.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <CardTitle className="font-headline text-xl">{hotel.name}</CardTitle>
                        <CardDescription>{hotel.location} - {hotel.rooms} rooms</CardDescription>
                    </div>
                    <span className={`mt-2 sm:mt-0 px-2 py-1 text-xs rounded-full ${hotel.status === 'Published' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {hotel.status}
                    </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This is where you'd see a summary of the hotel, like occupancy or recent bookings.
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <EditIcon className="mr-2 h-4 w-4" /> Edit Hotel / Rooms
                    </Button>
                    <Button variant="outline" size="sm">
                        View Bookings
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
