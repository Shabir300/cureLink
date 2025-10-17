'use server';

/**
 * @fileOverview An AI-powered symptom checker flow.
 *
 * - symptomChecker - A function that takes a symptom description and returns guidance.
 * - SymptomCheckerInput - The input type for the symptomChecker function.
 * - SymptomCheckerOutput - The return type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptomDescription: z
    .string()
    .describe('A description of the symptoms the patient is experiencing.'),
  medicalHistory: z
    .string()
    .optional()
    .describe('The patient\'s medical history, if available.'),
  chatHistory: z
    .string()
    .optional()
    .describe('The previous conversation history.'),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  guidance: z
    .string()
    .describe(
      'Guidance on what the patient should do based on their symptoms (e.g., take rest, book urgent appointment).'
    ),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(
  input: SymptomCheckerInput
): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are a friendly and empathetic AI medical assistant for CureLink. Your goal is to help patients understand their symptoms and guide them on the next steps.

You are having a conversation with a patient. Be polite, caring, and professional.

1.  If the user says "hi" or starts with a simple greeting, respond warmly, introduce yourself, and ask how you can help them with their health today.
2.  When the user describes their symptoms, analyze them carefully.
3.  If available, consider the patient's medical history:
    Medical History: {{{medicalHistory}}}
4.  Ask clarifying questions like a doctor would to get more details. For example: "How long have you had these symptoms?", "Is the pain sharp or dull?", "Do you have any other symptoms?".
5.  Based on the symptoms and history, provide clear, concise, and safe guidance.
6.  Always include a disclaimer that you are an AI assistant and this is not a substitute for professional medical advice.

Conversation History:
{{{chatHistory}}}

Patient's latest message:
"{{{symptomDescription}}}"

Your response:
`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
