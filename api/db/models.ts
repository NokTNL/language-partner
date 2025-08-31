import type { ConversationTable, LessonTable } from "../types/tables.ts";
import { db } from "./scripts.ts";

export function getLessons() {
  const lessons = db
    .prepare<never[], LessonTable>(`SELECT * FROM lesson`)
    .all();
  return lessons;
}

export function getLessonById(id: string) {
  const lesson = db
    .prepare<string, LessonTable>(`SELECT * FROM lesson WHERE id = ?`)
    .get(id);
  return lesson;
}

export function getConversationsByLessonIds(lessonIds: string[]) {
  const placeholders = lessonIds.map(() => "?").join(",");
  const conversations = db
    .prepare<string[], ConversationTable>(
      `SELECT * FROM conversation WHERE lessonId IN (${placeholders})`
    )
    .all(...lessonIds);
  return conversations;
}

export function createLesson(name: string, conversations: string[]) {
  const lessonId = crypto.randomUUID();
  const tx = db.transaction(() => {
    db.prepare<[string, string]>(
      `INSERT INTO lesson (id, name) VALUES (?,?)`
    ).run(lessonId, name);
    const insertStmt = db.prepare<[string, string, string]>(
      `INSERT INTO conversation (id, lessonId, content) VALUES (?,?,?)`
    );
    for (const convo of conversations) {
      insertStmt.run(crypto.randomUUID(), lessonId, convo);
    }
  });
  tx();
  return lessonId;
}

export function updateLesson(
  lessonId: string,
  name: string,
  conversations: string[]
) {
  const tx = db.transaction(() => {
    const updateLessonResult = db
      .prepare<[string, string]>(`UPDATE lesson SET name = ? WHERE id = ?`)
      .run(name, lessonId);
    if (updateLessonResult.changes === 0) throw Error("No lesson with this id");

    db.prepare<[string]>(`DELETE FROM conversation WHERE lessonId = ?`).run(
      lessonId
    );

    const insertStmt = db.prepare<[string, string, string]>(
      `INSERT INTO conversation (id, lessonId, content) VALUES (?,?,?)`
    );
    for (const convo of conversations) {
      insertStmt.run(crypto.randomUUID(), lessonId, convo);
    }
  });
  tx();
}

export function deleteLesson(lessonId: string) {
  const tx = db.transaction(() => {
    db.prepare<string>(`DELETE FROM conversation WHERE lessonId = ?`).run(
      lessonId
    );

    db.prepare<string>(`DELETE FROM lesson WHERE id = ?`).run(lessonId);
  });
  tx();
}
