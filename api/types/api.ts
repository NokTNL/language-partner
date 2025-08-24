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

export type GetConversationsByLessonIdResponseBody = ConversationTable[];

export type PutLessonRequestBody = {
  name: string;
  content: string[];
};

/**
 * Components
 */

export type MessageEntry = {
  type: "audio";
  src: string;
  transcription: string;
};
