// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview An AI agent that suggests similar clothing items based on a description.
 *
 * - findSimilarClothingItems - A function that handles the process of finding similar clothing items.
 * - FindSimilarClothingItemsInput - The input type for the findSimilarClothingItems function.
 * - FindSimilarClothingItemsOutput - The return type for the findSimilarClothingItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindSimilarClothingItemsInputSchema = z.object({
  description: z.string().describe('The description of the clothing item to find similar items for.'),
});
export type FindSimilarClothingItemsInput = z.infer<typeof FindSimilarClothingItemsInputSchema>;

const FindSimilarClothingItemsOutputSchema = z.object({
  similarItems: z.array(
    z.object({
      name: z.string().describe('The name of the similar clothing item.'),
      description: z.string().describe('A description of the similar clothing item.'),
      link: z.string().describe('A link to the online store where the item can be purchased.'),
      price: z.number().describe('The price of the item.'),
    })
  ).describe('A list of similar clothing items.'),
});
export type FindSimilarClothingItemsOutput = z.infer<typeof FindSimilarClothingItemsOutputSchema>;

export async function findSimilarClothingItems(input: FindSimilarClothingItemsInput): Promise<FindSimilarClothingItemsOutput> {
  return findSimilarClothingItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSimilarClothingItemsPrompt',
  input: {schema: FindSimilarClothingItemsInputSchema},
  output: {schema: FindSimilarClothingItemsOutputSchema},
  prompt: `You are a personal stylist helping users find similar clothing items to what they want.

  Based on the description of the clothing item provided by the user, find a list of similar clothing items that the user might be interested in.
  Return a list of similar items with their name, description, link to the online store, and price.

  Description: {{{description}}}
  `,
});

const findSimilarClothingItemsFlow = ai.defineFlow(
  {
    name: 'findSimilarClothingItemsFlow',
    inputSchema: FindSimilarClothingItemsInputSchema,
    outputSchema: FindSimilarClothingItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
