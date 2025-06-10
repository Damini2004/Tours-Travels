
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ListOrdered, SearchIcon, UserCheck, CalendarX } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Placeholder data - in a real app, fetch from backend
const placeholderBookings = [
  { id: "bk001", guestName: "Alice Wonderland", hotelName: "My Seaside Inn", checkIn: "2024-09-01", checkOut: "2024-09-05", status: "Confirmed" },
  { id: "bk002", guestName: "Bob The Builder", hotelName: "Downtown Boutique Hotel", checkIn: "2024-09-03", checkOut: "2024-09-07", status: "Pending" },
  { id: "bk003", guestName: "Charlie Brown", hotelName: "My Seaside Inn", checkIn: "2024-08-15", checkOut: "2024-08-18", status: "Completed" },
  { id: "bk004", guestName: "Diana Prince", hotelName: "My Seaside Inn", checkIn: "2024-09-10", checkOut: "2024-09-12", status: "Cancelled" },
];

export default function ManageBookingsPage() {
  const upcomingBookings = placeholderBookings.filter(b => new Date(b.checkIn) >= new Date() && (b.status === "Confirmed" || b.status === "Pending"));
  const pastBookings = placeholderBookings.filter(b => new Date(b.checkIn) < new Date() || b.status === "Completed" || b.status === "Cancelled");


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center">
          <ListOrdered className="mr-3 h-8 w-8 text-primary" /> Manage Bookings
        </h1>
        <p className="text-muted-foreground">View and manage reservations for your properties.</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upcoming"><UserCheck className="mr-2 h-4 w-4" />Upcoming & Pending ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past"><CalendarX className="mr-2 h-4 w-4" />Past & Cancelled ({pastBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length === 0 ? (
            <Alert>
              <SearchIcon className="h-4 w-4" />
              <AlertTitle>No Upcoming Bookings</AlertTitle>
              <AlertDescription>There are no upcoming or pending bookings at this time.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle>{booking.guestName} - {booking.hotelName}</CardTitle>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-primary/20 text-primary' 
                            : booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-600'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                            {booking.status}
                        </span>
                    </div>
                    <CardDescription>Check-in: {booking.checkIn} | Check-out: {booking.checkOut}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
                     <div className="mt-2 flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        {booking.status === "Pending" && <Button size="sm">Confirm Booking</Button>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
           {pastBookings.length === 0 ? (
            <Alert>
              <SearchIcon className="h-4 w-4" />
              <AlertTitle>No Past Bookings</AlertTitle>
              <AlertDescription>There are no completed or cancelled bookings to display.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {pastBookings.map(booking => (
                 <Card key={booking.id} className={booking.status === "Cancelled" ? "opacity-70" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle>{booking.guestName} - {booking.hotelName}</CardTitle>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'Completed' ? 'bg-green-500/20 text-green-700' 
                            : booking.status === 'Cancelled' ? 'bg-red-500/20 text-red-700'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                            {booking.status}
                        </span>
                    </div>
                    <CardDescription>Check-in: {booking.checkIn} | Check-out: {booking.checkOut}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
