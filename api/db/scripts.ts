import BetterSqlite3 from "better-sqlite3";
import path from "path";

export const db = new BetterSqlite3(path.resolve("db", "database.sqlite"));
db.pragma("journal_mode = WAL");

export function dbInit() {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS lesson(
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(200) UNIQUE
      )`
  ).run();
  db.prepare(
    `CREATE TABLE IF NOT EXISTS conversation(
        id VARCHAR(36) PRIMARY KEY,
        lessonId VARCHAR(36),
        content TEXT
      )`
  ).run();
}
