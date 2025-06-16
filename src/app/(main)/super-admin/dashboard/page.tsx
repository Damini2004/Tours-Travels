
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LayoutDashboard, UsersIcon, HotelIcon as HotelBuildingIcon, FileCheckIcon, LineChartIcon, DollarSignIcon, ListChecks, ShieldCheckIcon, Loader2, BriefcaseIcon } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';
import type { Hotel, Booking } from '@/lib/types';
import { getHotels } from '@/lib/hotel-data';

const BOOKINGS_DB_KEY = 'appBookingsDB';

export default function SuperAdminDashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [totalListings, setTotalListings] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const monthlyRevenue = 25000; // Placeholder

  const loadDashboardData = useCallback(() => {
    setIsLoading(true);
    const allHotels = getHotels();
    const approvedHotels = allHotels.filter(h => h.isApproved);
    const hotelsPendingApproval = allHotels.filter(h => !h.isApproved);

    setTotalListings(approvedHotels.length);
    setPendingApprovals(hotelsPendingApproval.length);

    if (typeof window !== "undefined") {
        const usersDBString = localStorage.getItem("usersDB");
        let users = usersDBString ? JSON.parse(usersDBString) : [];
        const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
        if (superAdminEmail && !users.find((u: any) => u.email === superAdminEmail)) {
            users.push({ email: superAdminEmail, role: "super_admin"});
        }
        setTotalUsers(users.length);

        const bookingsDBString = localStorage.getItem(BOOKINGS_DB_KEY);
        let bookings: Booking[] = [];
        if (bookingsDBString) {
            try {
                bookings = JSON.parse(bookingsDBString);
            } catch (e) { console.error("Error parsing bookings for SA dashboard", e); }
        }
        setTotalBookings(bookings.length);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-120px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))]">
      <div className="py-10 px-4 md:px-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg">
        <div className="container mx-auto">
            <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center text-white">
            <ShieldCheckIcon className="mr-3 h-10 w-10 text-primary" /> SUPER ADMIN PLATFORM OVERVIEW
            </h1>
            <p className="text-gray-300 font-medium mt-2 text-lg">Central hub for platform management and insights.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="font-headline text-2xl md:text-3xl font-bold flex items-center text-white">
            <LayoutDashboard className="mr-3 h-7 w-7 text-primary" /> Key Metrics
          </h2>
          <p className="text-gray-300">Platform overview and key statistics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Users", value: totalUsers, icon: UsersIcon, desc: "Registered users" },
            { title: "Pending Hotel Approvals", value: pendingApprovals, icon: FileCheckIcon, desc: "Hotels awaiting review" },
            { title: "Approved Listings", value: totalListings, icon: ListChecks, desc: "Live hotels on platform" },
            { title: "Total Bookings", value: totalBookings, icon: BriefcaseIcon, desc: "Across all hotels" },
            { title: "Monthly Revenue (Est.)", value: `$${monthlyRevenue.toLocaleString()}`, icon: DollarSignIcon, desc: "Current month estimate" }
          ].map((metric, index) => (
            <Card key={index} className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <p className="text-xs text-gray-400">{metric.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Alert className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 text-gray-200 shadow-xl">
          <LineChartIcon className="h-4 w-4 text-gray-400" />
          <AlertTitle className="text-white">Advanced Analytics Placeholder</AlertTitle>
          <AlertDescription className="text-gray-300">
            Detailed charts for user growth, booking trends, and revenue streams will be displayed here.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
