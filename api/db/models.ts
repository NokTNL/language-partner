import type { ConversationTable, LessonTable } from "../types/tables.ts";
import { db } from "./scripts.ts";

export function getLessons() {
  const lessons = db
    .prepare<never[], LessonTable>(`SELECT * FROM lesson`)
    .all();
  return lessons;
}

export function getConversationsByLessonId(lessonIds: string[]) {
  const placeholders = lessonIds.map(() => "?").join(",");
  const conversations = db
    .prepare<string[], ConversationTable>(
      `SELECT * FROM conversation WHERE lessonId IN (${placeholders})`
    )
    .all(...lessonIds);
  return conversations;
}

export function updateLesson(
  lessonId: string,
  name: string,
  conversations: string[]
) {
  const tx = db.transaction(() => {
    db.prepare<[string, string], void>(
      `UPDATE lesson SET name = ? WHERE id = ?`
    ).run(name, lessonId);

    db.prepare<[string], void>(
      `DELETE FROM conversation WHERE lessonId = ?`
    ).run(lessonId);

    const insertStmt = db.prepare<[string, string, string], void>(
      `INSERT INTO conversation (id, lessonId, content) VALUES (?,?,?)`
    );
    for (const convo of conversations) {
      insertStmt.run(crypto.randomUUID(), lessonId, convo);
    }
  });
  tx();
}
