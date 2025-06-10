import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaneIcon, HotelIcon, LogInIcon, UserPlusIcon } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-background text-foreground shadow-md backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <span className="text-xl font-headline font-semibold text-primary">Hotel&Tour</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" className="text-foreground hover:bg-muted/50" asChild>
            <Link href="/hotels/search" prefetch={false}><HotelIcon className="mr-2 h-4 w-4" />Hotels</Link>
          </Button>
          <Button variant="ghost" className="text-foreground hover:bg-muted/50" asChild>
            <Link href="/flights/search" prefetch={false}><PlaneIcon className="mr-2 h-4 w-4" />Flights</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
            <Link href="/login" prefetch={false}><LogInIcon className="mr-2 h-4 w-4" />Log In</Link>
          </Button>
          <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/signup" prefetch={false}><UserPlusIcon className="mr-2 h-4 w-4" />Sign Up</Link>
          </Button>
        </div>
        {/* Mobile menu could be added here */}
      </div>
    </header>
  );
}
