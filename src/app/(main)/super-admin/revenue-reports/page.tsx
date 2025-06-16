
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LineChartIcon, DollarSignIcon, DownloadIcon, BarChartIcon, TrendingUpIcon } from "lucide-react";

const totalPlatformRevenue = 125670.50;
const averageBookingValue = 350.75;
const revenueLast30Days = 15230.00;

export default function RevenueReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-var(--header-height,0px)-var(--footer-height,0px))]">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center text-white">
          <LineChartIcon className="mr-3 h-8 w-8 text-primary" /> Revenue Reports
        </h1>
        <p className="text-gray-300">Track platform earnings, booking values, and financial trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Total Platform Revenue", value: `$${totalPlatformRevenue.toLocaleString()}`, icon: DollarSignIcon, desc: "All-time gross revenue" },
          { title: "Revenue (Last 30 Days)", value: `$${revenueLast30Days.toLocaleString()}`, icon: TrendingUpIcon, desc: "+8.1% from previous period" },
          { title: "Average Booking Value", value: `$${averageBookingValue.toLocaleString()}`, icon: BarChartIcon, desc: "Across all bookings" },
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
      
      <Card className="mb-8 bg-slate-800/60 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Detailed Financial Report</CardTitle>
          <CardDescription className="text-gray-300">Download comprehensive financial statements.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert className="bg-slate-700/50 border-slate-600 text-gray-300">
                <DownloadIcon className="h-4 w-4 text-gray-400"/>
                <AlertTitle className="text-gray-200">Report Generation Placeholder</AlertTitle>
                <AlertDescription>Functionality to generate and download CSV/PDF reports will be implemented here.</AlertDescription>
            </Alert>
            <div className="mt-4">
                <Button variant="outline" className="border-gray-500 text-gray-200 hover:bg-gray-700 hover:border-gray-600">
                    <DownloadIcon className="mr-2 h-4 w-4" /> Download Monthly Statement (Placeholder)
                </Button>
            </div>
        </CardContent>
      </Card>

      <Alert className="bg-slate-800/60 backdrop-blur-md border border-slate-700/80 text-gray-200 shadow-xl">
        <LineChartIcon className="h-4 w-4 text-gray-400" />
        <AlertTitle className="text-white">Revenue Charts Placeholder</AlertTitle>
        <AlertDescription className="text-gray-300">
          Interactive charts showing revenue trends, revenue by source (hotels/flights), and commission breakdowns will be available here.
        </AlertDescription>
      </Alert>
    </div>
  );
}
