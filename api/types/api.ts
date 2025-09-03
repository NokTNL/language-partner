import z from "zod";
import type { ConversationTable } from "./tables.ts";

/**
 * Chat routes
 */
export const SPostSpeechMessageRequestBody = z.object({
  previous_response_id: z.string().optional(),
  user_input: z.string().optional(),
  lessons: z.array(z.string().uuid()).min(1),
});
export type PostSpeechMessageRequestBody = z.infer<
  typeof SPostSpeechMessageRequestBody
>;

export type PostSpeechMessageResponseBody = {
  id: string;
  entries: MessageEntry[];
  isEndOfConversation: boolean;
};

/**
 * Transcription routes
 */
export type PostTranscriptionResponseBody = {
  transcription: string;
};

/**
 * Lesson routes
 */
export type GetLessonsResponseBody = {
  id: string;
  name: string;
}[];

export type GetLessonByIdResponseBody = {
  id: string;
  name: string;
  conversations: ConversationTable[];
};

export const SPostLessonRequestBody = z.object({
  name: z.string().nonempty(),
  conversations: z.array(z.string().nonempty()).min(1),
});

export type PostLessonRequestBody = z.infer<typeof SPostLessonRequestBody>;

export type PostLessonResponseBody = {
  id: string;
};

export const SPutLessonRequestBody = z.object({
  name: z.string().nonempty(),
  conversations: z.array(z.string().nonempty()).min(1),
});

export type PutLessonRequestBody = z.infer<typeof SPutLessonRequestBody>;

/**
 * Components
 */

export type MessageEntry = {
  type: "audio";
  src: string;
  transcription: string;
};
