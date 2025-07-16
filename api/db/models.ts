import type { ConversationTable, LessonTable } from "../types/tables.ts";
import { db } from "./scripts.ts";

export function getConversationByLessonId(lessonIds: string[]) {
  const placeholders = lessonIds.map(() => "?").join(",");
  const conversations = db
    .prepare<string[], Pick<ConversationTable, "content">>(
      `SELECT content FROM conversation WHERE lessonId IN (${placeholders})`
    )
    .all(...lessonIds)
    .map(({ content }) => content);
  return conversations;
}

export function getLessons() {
  const lessons = db
    .prepare<never[], LessonTable>(`SELECT * FROM lesson`)
    .all();
  return lessons;
}
