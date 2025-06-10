'use server';

/**
 * @fileOverview Suggests nearby hotels and interesting locations after a flight booking.
 *
 * - suggestLocations - A function that suggests locations.
 * - SuggestLocationsInput - The input type for the suggestLocations function.
 * - SuggestLocationsOutput - The return type for the suggestLocations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLocationsInputSchema = z.object({
  flightDestination: z.string().describe('The destination of the booked flight.'),
  flightDates: z.string().describe('The dates of the flight.'),
  interests: z.string().optional().describe('Optional user interests.'),
});
export type SuggestLocationsInput = z.infer<typeof SuggestLocationsInputSchema>;

const SuggestLocationsOutputSchema = z.object({
  nearbyHotels: z.string().describe('A list of suggested nearby hotels.'),
  interestingLocations: z.string().describe('A list of interesting locations to visit.'),
});
export type SuggestLocationsOutput = z.infer<typeof SuggestLocationsOutputSchema>;

export async function suggestLocations(input: SuggestLocationsInput): Promise<SuggestLocationsOutput> {
  return suggestLocationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLocationsPrompt',
  input: {schema: SuggestLocationsInputSchema},
  output: {schema: SuggestLocationsOutputSchema},
  prompt: `You are a travel expert. A user has booked a flight to {{flightDestination}} for {{flightDates}}.\n\nSuggest nearby hotels and interesting locations for them to visit. Consider the user's interests if provided: {{interests}}.\n\nFormat your output as lists of hotels and locations.`, 
});

const suggestLocationsFlow = ai.defineFlow(
  {
    name: 'suggestLocationsFlow',
    inputSchema: SuggestLocationsInputSchema,
    outputSchema: SuggestLocationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
