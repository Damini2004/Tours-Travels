
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for login logic
    console.log("Login attempt:", { email, password });

    if (typeof window !== "undefined") {
      let userRole = "guest"; // Default role
      let userName = email.split('@')[0]; 
      const existingUsersString = localStorage.getItem("usersDB"); // Simulate a user database
      let userFound = false;

      if (existingUsersString) {
        try {
          const usersDB = JSON.parse(existingUsersString);
          const foundUser = usersDB.find((user: any) => user.email === email);
          if (foundUser) {
            // In a real app, you would also verify the password here
            userRole = foundUser.role;
            userName = foundUser.fullName || userName;
            userFound = true;
          }
        } catch (err) {
          console.warn("Error parsing usersDB from localStorage", err);
        }
      }
      
      // If user wasn't in our "DB", check if they previously logged in directly
      // This part is more for continuity if they used old login before DB simulation
      if (!userFound) {
         const legacyUserString = localStorage.getItem("currentUser");
         if (legacyUserString) {
            try {
                const legacyUser = JSON.parse(legacyUserString);
                if (legacyUser.email === email) {
                    userRole = legacyUser.role || "guest";
                    userName = legacyUser.fullName || userName;
                }
            } catch (error) {
                //
            }
         }
      }


      localStorage.setItem("currentUser", JSON.stringify({ fullName: userName, email, role: userRole }));
      // alert("Login successful!"); // Removed for smoother UX
      const redirectUrl = searchParams.get('redirect') || '/';
      router.push(redirectUrl); 
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-128px)]"> {/* Adjust min-height based on header/footer */}
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <LogInIcon className="mx-auto h-10 w-10 text-primary mb-2" />
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
          <Link href="#" className="text-primary hover:underline mb-2">
            Forgot password?
          </Link>
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
