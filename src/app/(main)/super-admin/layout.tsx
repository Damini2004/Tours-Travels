
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2Icon, ShieldAlertIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// Header is part of the (main)/layout.tsx, not re-imported here

interface CurrentUser {
  fullName: string;
  email: string;
  role: string;
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const user: CurrentUser = JSON.parse(storedUser);
          setCurrentUser(user);
          if (user.role === 'super_admin') {
            setIsAuthorized(true);
          } else {
            router.replace('/'); 
          }
        } catch (e) {
          console.error("Failed to parse currentUser for super admin layout", e);
          localStorage.removeItem("currentUser");
          router.replace(`/login?redirect=${pathname}`);
        }
      } else {
        router.replace(`/login?redirect=${pathname}`);
      }
      setIsLoading(false);
    }
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63]">
        <Loader2Icon className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-300">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthorized && !isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] p-4">
            <Alert variant="destructive" className="max-w-md text-center bg-white/10 backdrop-blur-md border border-red-500/50 text-red-300">
                <ShieldAlertIcon className="h-6 w-6 mx-auto mb-2 text-red-400" />
                <AlertTitle className="text-xl font-bold text-red-300">Access Denied</AlertTitle>
                <AlertDescription className="text-red-300/90">
                You do not have permission to view this page. This area is restricted to Super Administrators.
                </AlertDescription>
                <Button asChild className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/">Return to Homepage</Link>
                </Button>
            </Alert>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col"> {/* This div is already wrapped by (main)/layout.tsx's structure */}
      <main className="flex-grow bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63]">
        {children}
      </main>
      {/* Footer removed from here */}
    </div>
  );
}
