export type Message = {
  id: string;
  source: "assistant" | "user";
  entries: {
    type: "audio";
    src: string;
    transcription: string;
  }[];
};
