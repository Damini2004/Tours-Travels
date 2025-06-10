
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlaneIcon, HotelIcon, LogInIcon, UserPlusIcon, HeartIcon, ListChecksIcon, LogOutIcon, UserCircle, BriefcaseIcon, LayoutDashboard, ListOrdered, DollarSign
} from 'lucide-react';

interface CurrentUser {
  fullName: string;
  email: string;
  role: string;
}

export function Header() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Only run on the client

    const loadUser = () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse currentUser from localStorage", e);
          localStorage.removeItem("currentUser"); // Clear corrupted item
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    loadUser(); // Initial load

    // Listen to storage changes that might occur in other tabs or from direct manipulation.
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "currentUser") {
        loadUser();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Re-check on route change, useful if login/signup doesn't cause a full page reload
    // but Next.js router navigates.
    // The `router` object itself is stable, so direct dependency might not always re-trigger.
    // However, `loadUser` being called on mount and storage events should cover most cases.
    // For explicit re-check on navigation, one might need to tap into router.events if available,
    // or rely on the fact that navigation often re-mounts components or causes effects to re-run.
    // For this simple localStorage setup, the initial load and storage event listener are key.

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, [isClient, router]); // router dependency helps re-evaluate if navigation pattern triggers it


  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
    }
    setCurrentUser(null);
    router.push('/'); 
  };

  if (!isClient) {
    // Render a placeholder or null during SSR/pre-hydration to avoid mismatch
    return (
      <header className="bg-background text-foreground shadow-md backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <span className="text-xl font-headline font-semibold text-primary">Hotel&Tour</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
            <div className="h-9 w-24 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-background/80 text-foreground shadow-md backdrop-blur-md sticky top-0 z-50">
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
          {currentUser && (
            <>
              <Button variant="ghost" className="text-foreground hover:bg-muted/50" asChild>
                <Link href="/saved" prefetch={false}><HeartIcon className="mr-2 h-4 w-4" />Saved</Link>
              </Button>
              <Button variant="ghost" className="text-foreground hover:bg-muted/50" asChild>
                <Link href="/my-bookings" prefetch={false}><ListChecksIcon className="mr-2 h-4 w-4" />My Bookings</Link>
              </Button>
            </>
          )}

          {currentUser?.role === 'hotel_owner' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:bg-muted/50">
                  <BriefcaseIcon className="mr-2 h-4 w-4" /> Hotel Owner
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Owner Dashboard</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/hotel-owner/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Analytics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hotel-owner/register-hotel"><HotelIcon className="mr-2 h-4 w-4" />Register Hotel</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hotel-owner/my-hotels"><ListChecksIcon className="mr-2 h-4 w-4" />My Hotels</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hotel-owner/manage-bookings"><ListOrdered className="mr-2 h-4 w-4" />Manage Bookings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hotel-owner/earnings"><DollarSign className="mr-2 h-4 w-4" />Earnings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                   <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email} ({currentUser.role})
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
                <Link href="/login" prefetch={false}><LogInIcon className="mr-2 h-4 w-4" />Log In</Link>
              </Button>
              <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/signup" prefetch={false}><UserPlusIcon className="mr-2 h-4 w-4" />Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        {/* Mobile menu could be added here */}
      </div>
    </header>
  );
}
