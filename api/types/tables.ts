export type LessonTable = {
  id: string;
  name: string;
};

export type ConversationTable = {
  id: string;
  lessonId: string;
  content: string;
};
