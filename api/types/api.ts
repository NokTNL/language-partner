import z from "zod";
import type { ConversationTable } from "./tables.ts";

/**
 * Chat routes
 */
export type PostSpeechMessageRequestBody = {
  previous_response_id?: string;
  user_input?: string;
  lessons: string[];
};

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
  content: z.array(z.string().nonempty()).nonempty(),
});

export type PostLessonRequestBody = z.infer<typeof SPostLessonRequestBody>;

export type PostLessonResponseBody = {
  id: string;
};

export const SPutLessonRequestBody = z.object({
  name: z.string().nonempty(),
  content: z.array(z.string().nonempty()).nonempty(),
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
