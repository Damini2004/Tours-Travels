import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MountainIcon, PlaneIcon, HotelIcon, StarIcon, BotIcon } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary/90 text-primary-foreground shadow-md backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <MountainIcon className="h-6 w-6 text-accent" />
          <span className="text-xl font-headline font-semibold">Horizon Stays</span>
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link href="/" prefetch={false}>Home</Link>
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link href="/flights" prefetch={false}><PlaneIcon className="mr-2 h-4 w-4" />Flights</Link>
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link href="/hotels" prefetch={false}><HotelIcon className="mr-2 h-4 w-4" />Hotels</Link>
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link href="/saved" prefetch={false}><StarIcon className="mr-2 h-4 w-4" />Saved</Link>
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link href="/ai-suggestions" prefetch={false}><BotIcon className="mr-2 h-4 w-4" />AI Tips</Link>
          </Button>
        </nav>
        {/* Mobile menu could be added here */}
      </div>
    </header>
  );
}
