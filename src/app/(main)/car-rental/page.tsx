
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarIcon } from "lucide-react";

export default function CarRentalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CarIcon className="mr-2 h-6 w-6 text-primary" />
            Car Rental
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our car rental service is coming soon! Find the perfect vehicle for your travels.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
