'use server';
/**
 * @fileOverview Outfit suggestion flow based on items in a wishlist.
 *
 * - generateOutfitSuggestions - A function to generate outfit suggestions.
 * - OutfitSuggestionInput - The input type for the generateOutfitSuggestions function.
 * - OutfitSuggestionOutput - The return type for the generateOutfitSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OutfitSuggestionInputSchema = z.object({
  wishlistItems: z.array(
    z.object({
      description: z.string().describe('Description of the clothing item'),
      imageUrl: z.string().describe('URL of the clothing item image'),
      size: z.string().optional().describe('Desired size of the item'),
      color: z.string().optional().describe('Desired color of the item'),
      price: z.number().optional().describe('Price of the item'),
    })
  ).describe('Array of clothing items in the wishlist'),
});
export type OutfitSuggestionInput = z.infer<typeof OutfitSuggestionInputSchema>;

const OutfitSuggestionOutputSchema = z.object({
  outfitSuggestions: z.array(z.string()).describe('Array of outfit suggestions'),
});
export type OutfitSuggestionOutput = z.infer<typeof OutfitSuggestionOutputSchema>;

export async function generateOutfitSuggestions(input: OutfitSuggestionInput): Promise<OutfitSuggestionOutput> {
  return outfitSuggestionFlow(input);
}

const outfitSuggestionPrompt = ai.definePrompt({
  name: 'outfitSuggestionPrompt',
  input: {schema: OutfitSuggestionInputSchema},
  output: {schema: OutfitSuggestionOutputSchema},
  prompt: `Given the following list of clothing items from a user's wishlist, generate outfit suggestions on how to combine these items. Provide several distinct outfit suggestions.

Wishlist Items:
{{#each wishlistItems}}
- Description: {{description}}
  Image URL: {{imageUrl}}
  {{#if size}}Size: {{size}}{{/if}}
  {{#if color}}Color: {{color}}{{/if}}
  {{#if price}}Price: {{price}}{{/if}}
{{/each}}

Outfit Suggestions:`, 
});

const outfitSuggestionFlow = ai.defineFlow(
  {
    name: 'outfitSuggestionFlow',
    inputSchema: OutfitSuggestionInputSchema,
    outputSchema: OutfitSuggestionOutputSchema,
  },
  async input => {
    const {output} = await outfitSuggestionPrompt(input);
    return output!;
  }
);
