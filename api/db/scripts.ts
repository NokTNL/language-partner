import BetterSqlite3 from "better-sqlite3";
import path from "path";

export const db = new BetterSqlite3(path.resolve("db", "database.sqlite"));
db.pragma("journal_mode = WAL");

export function dbInit() {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS lesson(
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(200) UNIQUE
      )`
  ).run();
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS conversation(
        id VARCHAR(36) PRIMARY KEY,
        lessonId VARCHAR(36),
        content TEXT
      )`
  ).run();

  // TODO: delete this once UI is done
  // Adding a new lesson
  // db.prepare<[string, string]>(`INSERT INTO lesson VALUES (?,?)`).run(
  //   crypto.randomUUID(),
  //   "Lesson 1"
  // );

  // Adding conversation to a lesson
  //   const lesson = db
  //     .prepare<never[], { id: string }>(
  //       "SELECT id FROM lesson WHERE name = 'Lesson 1'"
  //     )
  //     .get();
  //   if (!lesson) throw Error("No id matches 'Lesson 1' in table 'lesson'");

  //   db.prepare<[string, string, string]>(
  //     "INSERT INTO conversation VALUES (?,?,?)"
  //   ).run(
  //     crypto.randomUUID(),
  //     lesson.id,
  //     `Hi! How are you?
  // I am fine thanks, and you?
  // I am good too.`
  //   );
}
