
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SailboatIcon } from "lucide-react";

export default function ToursPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <SailboatIcon className="mr-2 h-6 w-6 text-primary" />
            Tours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our tours page is currently under construction. Please check back soon for exciting tour packages!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
