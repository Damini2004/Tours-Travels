
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ListChecksIcon, BriefcaseIcon } from "lucide-react"; // Or TicketIcon, PackageIcon
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyBookingsPage() {
  // In a real app, you would fetch booking data for the logged-in user
  const bookings: any[] = []; // Placeholder for bookings

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <BriefcaseIcon className="mx-auto h-12 w-12 text-primary mb-2" />
        <h1 className="font-headline text-3xl md:text-4xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your hotel and flight reservations.</p>
      </div>

      {bookings.length === 0 ? (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecksIcon className="mr-2 h-6 w-6 text-muted-foreground" />
              No Bookings Yet
            </CardTitle>
            <CardDescription>
              You haven&apos;t made any bookings yet. Once you book a hotel or flight, it will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Alert variant="default" className="bg-card">
                <ListChecksIcon className="h-4 w-4" />
                <AlertTitle>Ready to explore?</AlertTitle>
                <AlertDescription>
                    Find your next adventure and book your stay or flight.
                </AlertDescription>
            </Alert>
            <div className="mt-6 flex justify-center gap-4">
                <Button asChild>
                    <Link href="/hotels/search">Find Hotels</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/flights/search">Find Flights</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* 
            This is where you would map over actual booking data.
            Example structure for a booking card:
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle>{booking.type === 'hotel' ? booking.hotelName : booking.flightDetails}</CardTitle>
                <CardDescription>Booking ID: {booking.id} - Status: {booking.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Date: {booking.date}</p>
                <p>Total Price: ${booking.price}</p>
              </CardContent>
              <CardFooter>
                <Button variant="link">View Details</Button>
              </CardFooter>
            </Card>
          */}
          <p className="text-center text-muted-foreground">Booking display will be implemented here.</p>
        </div>
      )}
    </div>
  );
}
