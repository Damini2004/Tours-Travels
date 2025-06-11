
"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  PlaneIcon, HotelIcon, LogInIcon, UserPlusIcon, HeartIcon, ListChecksIcon, LogOutIcon, UserCircle, BriefcaseIcon, LayoutDashboard, ListOrdered, DollarSign, UsersIcon, ShieldCheckIcon, FileCheckIcon, Trash2Icon, LineChartIcon, MenuIcon
} from 'lucide-react';

interface CurrentUser {
  fullName: string;
  email: string;
  role: string;
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadUser = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const userObj = JSON.parse(storedUser);
          setCurrentUser(userObj);
        } catch (e) {
          console.error("Header: Failed to parse currentUser from localStorage", e);
          localStorage.removeItem("currentUser");
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    loadUser(); 

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "currentUser") {
        loadUser(); 
      }
    };

    const handleAuthChange = () => {
        loadUser(); 
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };

  }, [isClient, pathname, loadUser]);


  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new CustomEvent('authChange')); 
    }
    setCurrentUser(null); 
    setIsMobileMenuOpen(false); // Close mobile menu on logout
    router.push('/'); 
    router.refresh(); 
  };

  const NavLinkButton = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon?: React.ElementType }) => (
    <Button variant="ghost" asChild className="w-full justify-start text-base py-3" onClick={() => setIsMobileMenuOpen(false)}>
      <Link href={href}>
        {Icon && <Icon className="mr-3 h-5 w-5" />}
        {children}
      </Link>
    </Button>
  );


  if (!isClient) {
    return (
      <header className="bg-background/80 text-foreground shadow-md backdrop-blur-md sticky top-0 z-50">
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
        <Link href="/" className="flex items-center gap-2" prefetch={false} onClick={() => setIsMobileMenuOpen(false)}>
          <span className="text-xl font-headline font-semibold text-primary">Hotel&Tour</span>
        </Link>
        
        {/* Desktop Navigation */}
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
                <DropdownMenuItem asChild><Link href="/hotel-owner/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Analytics</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/hotel-owner/register-hotel"><HotelIcon className="mr-2 h-4 w-4" />Register Hotel</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/hotel-owner/my-hotels"><ListChecksIcon className="mr-2 h-4 w-4" />My Hotels</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/hotel-owner/manage-bookings"><ListOrdered className="mr-2 h-4 w-4" />Manage Bookings</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/hotel-owner/earnings"><DollarSign className="mr-2 h-4 w-4" />Earnings</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {currentUser?.role === 'super_admin' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:bg-muted/50">
                  <ShieldCheckIcon className="mr-2 h-4 w-4" /> Super Admin
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/super-admin/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Overview</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/super-admin/manage-users"><UsersIcon className="mr-2 h-4 w-4" />Manage Users</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link href="/super-admin/approve-hotels"><FileCheckIcon className="mr-2 h-4 w-4" />Approve Hotels</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/super-admin/remove-listings"><Trash2Icon className="mr-2 h-4 w-4" />Remove Listings</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/super-admin/revenue-reports"><LineChartIcon className="mr-2 h-4 w-4" />Revenue Reports</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-2">
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
                      {currentUser.email} ({currentUser.role.replace('_', ' ')})
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

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 pt-4 flex flex-col">
              <SheetHeader className="px-4 pb-2 border-b">
                <SheetTitle className="text-left">
                    <Link href="/" className="text-xl font-headline font-semibold text-primary" onClick={() => setIsMobileMenuOpen(false)}>Hotel&Tour</Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto p-4 space-y-1">
                <NavLinkButton href="/hotels/search" icon={HotelIcon}>Hotels</NavLinkButton>
                <NavLinkButton href="/flights/search" icon={PlaneIcon}>Flights</NavLinkButton>

                {currentUser && (
                  <>
                    <NavLinkButton href="/saved" icon={HeartIcon}>Saved</NavLinkButton>
                    <NavLinkButton href="/my-bookings" icon={ListChecksIcon}>My Bookings</NavLinkButton>
                    
                    <Separator className="my-3" />
                    <div className="px-2 py-1.5">
                        <p className="text-sm font-medium leading-none">{currentUser.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {currentUser.email}
                        </p>
                         <p className="text-xs leading-none text-muted-foreground mt-1 capitalize">
                          Role: {currentUser.role.replace('_', ' ')}
                        </p>
                    </div>

                    {currentUser.role === 'hotel_owner' && (
                      <>
                        <Separator className="my-3" />
                        <p className="px-2 pt-2 pb-1 text-sm font-semibold text-muted-foreground">Hotel Owner</p>
                        <NavLinkButton href="/hotel-owner/dashboard" icon={LayoutDashboard}>Analytics</NavLinkButton>
                        <NavLinkButton href="/hotel-owner/register-hotel" icon={HotelIcon}>Register Hotel</NavLinkButton>
                        <NavLinkButton href="/hotel-owner/my-hotels" icon={ListChecksIcon}>My Hotels</NavLinkButton>
                        <NavLinkButton href="/hotel-owner/manage-bookings" icon={ListOrdered}>Manage Bookings</NavLinkButton>
                        <NavLinkButton href="/hotel-owner/earnings" icon={DollarSign}>Earnings</NavLinkButton>
                      </>
                    )}

                    {currentUser.role === 'super_admin' && (
                      <>
                        <Separator className="my-3" />
                        <p className="px-2 pt-2 pb-1 text-sm font-semibold text-muted-foreground">Super Admin</p>
                        <NavLinkButton href="/super-admin/dashboard" icon={LayoutDashboard}>Overview</NavLinkButton>
                        <NavLinkButton href="/super-admin/manage-users" icon={UsersIcon}>Manage Users</NavLinkButton>
                        <NavLinkButton href="/super-admin/approve-hotels" icon={FileCheckIcon}>Approve Hotels</NavLinkButton>
                        <NavLinkButton href="/super-admin/remove-listings" icon={Trash2Icon}>Remove Listings</NavLinkButton>
                        <NavLinkButton href="/super-admin/revenue-reports" icon={LineChartIcon}>Revenue Reports</NavLinkButton>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="p-4 border-t mt-auto space-y-2">
                {currentUser ? (
                    <Button variant="outline" className="w-full justify-start text-base py-3" onClick={handleLogout}>
                        <LogOutIcon className="mr-3 h-5 w-5" />Log out
                    </Button>
                ) : (
                    <>
                        <NavLinkButton href="/login" icon={LogInIcon}>Log In</NavLinkButton>
                        <NavLinkButton href="/signup" icon={UserPlusIcon}>Sign Up</NavLinkButton>
                    </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
