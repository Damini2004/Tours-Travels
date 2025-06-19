
// Placeholder page for /airbnb
import { Construction, HomeIcon } from "lucide-react";

export default function AirbnbPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <HomeIcon className="w-16 h-16 text-[#0c4d52] mb-6" />
      <h1 className="text-4xl font-headline font-bold mb-4">Airbnb Clone</h1>
      <p className="text-xl text-muted-foreground text-center max-w-2xl">
        This section is currently under development. We are working on bringing you an Airbnb-like experience.
      </p>
      <p className="text-md text-muted-foreground text-center max-w-2xl mt-4">
        Stay tuned for updates!
      </p>
    </div>
  );
}
