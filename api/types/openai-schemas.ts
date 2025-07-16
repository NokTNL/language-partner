import { z } from "zod";

export const SExplanationOrConversation = z.object({
  type: z.union([z.literal("conversation"), z.literal("explanation")]),
  content: z.string(),
  attributes: z.object({
    gender: z.union([z.literal("male"), z.literal("female")]),
    isEndOfConversation: z.boolean().nullable(),
  }),
});
export type ExplanationOrConversation = z.infer<
  typeof SExplanationOrConversation
>;
export const SExplanationOrConversationEntries = z.object({
  entries: z.array(SExplanationOrConversation),
});
export type ExplanationOrConversationEntries = z.infer<
  typeof SExplanationOrConversationEntries
>;
