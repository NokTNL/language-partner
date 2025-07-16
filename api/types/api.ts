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

export type PostTranscriptionResponseBody = {
  transcription: string;
};

export type GetLessonsResponseBody = {
  id: string;
  name: string;
}[];

export type MessageEntry = {
  type: "audio";
  src: string;
  transcription: string;
};
