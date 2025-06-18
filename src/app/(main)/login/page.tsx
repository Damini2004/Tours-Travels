
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";

<<<<<<< HEAD
function LoginForm() {
const router = useRouter();
=======
const gradientTextClass = "bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] bg-clip-text text-transparent";

export default function LoginPage() {
  const router = useRouter();
>>>>>>> 04e13cb (over the place of this color use this color bg-gradient-to-br from-[#031)
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (typeof window !== "undefined") {
      // Check for Super Admin first
      const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
      const superAdminPassword = process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD;

      if (email === superAdminEmail && password === superAdminPassword) {
        const superAdminDetails = {
          fullName: "Super Admin",
          email: email,
          role: "super_admin"
        };
        localStorage.setItem("currentUser", JSON.stringify(superAdminDetails));
        window.dispatchEvent(new CustomEvent('authChange')); // Dispatch event
        const redirectUrl = searchParams.get('redirect') || '/';
        router.push(redirectUrl);
        router.refresh();
        toast({
          title: "Login Successful",
          description: `Welcome back, Super Admin!`,
        });
        return; 
      }

      const existingUsersString = localStorage.getItem("usersDB");
      let usersDB: any[] = [];
      let userFound = false;
      let currentUserDetails = null;

      if (existingUsersString) {
        try {
          usersDB = JSON.parse(existingUsersString);
        } catch (err) {
          console.warn("Error parsing usersDB from localStorage", err);
        }
      }

      const foundUser = usersDB.find(
        (user: any) => user.email === email && user.password === password 
      );

      if (foundUser) {
        currentUserDetails = { 
          fullName: foundUser.fullName, 
          email: foundUser.email, 
          role: foundUser.role 
        };
        userFound = true;
      }

      if (userFound && currentUserDetails) {
        localStorage.setItem("currentUser", JSON.stringify(currentUserDetails));
        window.dispatchEvent(new CustomEvent('authChange')); // Dispatch event
        const redirectUrl = searchParams.get('redirect') || '/';
        router.push(redirectUrl);
        router.refresh(); 
        toast({
          title: "Login Successful",
          description: `Welcome back, ${currentUserDetails.fullName}!`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again or sign up.",
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-128px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <LogInIcon className="mx-auto h-10 w-10 text-[#0c4d52] mb-2" />
          <CardTitle className="font-headline text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Log in to access your account and bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <Link href="#" className={`${gradientTextClass} hover:opacity-80 mb-2`}>
            Forgot password?
          </Link>
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className={`${gradientTextClass} hover:opacity-80 font-medium`}>
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
