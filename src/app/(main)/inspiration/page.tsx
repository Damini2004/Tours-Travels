
// Placeholder page for /inspiration
import { Lightbulb } from "lucide-react";

export default function InspirationPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Lightbulb className="w-16 h-16 text-primary mb-6" />
      <h1 className="text-4xl font-headline font-bold mb-4">Travel Inspiration</h1>
      <p className="text-xl text-muted-foreground text-center max-w-2xl">
        Looking for your next getaway idea? Our Travel Inspiration section is coming soon, filled with guides, tips, and breathtaking destinations to spark your wanderlust.
      </p>
    </div>
  );
}
