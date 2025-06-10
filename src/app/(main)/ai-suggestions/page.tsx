"use client";

import { useState } from 'react';
import { AiSuggestionsForm } from '@/components/forms/ai-suggestions-form';
import { AiSuggestionsDisplay } from '@/components/ai/ai-suggestions-display';
import { suggestLocations, type SuggestLocationsInput, type SuggestLocationsOutput } from '@/ai/flows/suggest-locations';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AiSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<SuggestLocationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetSuggestions = async (data: SuggestLocationsInput) => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await suggestLocations(data);
      setSuggestions(result);
      toast({
        title: "Suggestions Generated!",
        description: "AI has provided some travel tips for you.",
      });
    } catch (e) {
      console.error("Error getting AI suggestions:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get suggestions: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Could not fetch AI suggestions. ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-3">AI Powered Travel Suggestions</h1>
        <p className="text-lg text-muted-foreground">
          Let our AI help you plan your trip! Provide your flight details and interests,
          and we'll suggest nearby hotels and interesting locations for your destination.
        </p>
      </div>
      
      <AiSuggestionsForm onSubmit={handleGetSuggestions} isLoading={isLoading} />

      {error && (
        <Alert variant="destructive" className="mt-8 w-full max-w-2xl">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Display suggestions after loading and if no error */}
      {!isLoading && !error && suggestions && (
         <AiSuggestionsDisplay suggestions={suggestions} />
      )}

      {/* Show placeholder while loading IF there are no prior suggestions or errors */}
      {isLoading && !suggestions && !error && (
        <div className="mt-8 w-full max-w-2xl space-y-6 animate-pulse">
            <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
             <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
        </div>
      )}
    </div>
  );
}
