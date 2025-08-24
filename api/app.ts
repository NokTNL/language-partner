import express from "express";
import chatRoute from "./routes/chat.ts";
import getTranscriptionRoute from "./routes/transcription.ts";
import lessonsRoute from "./routes/lessons.ts";
import fileUpload from "express-fileupload";
import cors from "cors";
import { db, dbInit } from "./db/scripts.ts";
import path from "path";
import os from "os";
import fs from "fs/promises";

dbInit();

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
// TODO: may not need this if using a server
app.use(express.static("public"));
app.use(chatRoute);
app.use(getTranscriptionRoute);
app.use(lessonsRoute);

const server = app.listen(3156);

// TODO: remove this when added UI database editing functionality
// Backup database in home directory when reloading
process.on("SIGTERM", () => {
  server.close(async () => {
    await fs.mkdir(path.resolve(os.homedir(), "langauge-partner-backup"), {
      recursive: true,
    });
    await db.backup(
      path.resolve(
        os.homedir(),
        "langauge-partner-backup",
        `${new Date()
          .toISOString()
          .replace(/\.[0-9]{3}Z/g, "")
          .replace(/[:T]/g, "_")}-database-backup.sqlite`
      )
    );
    console.log("Finished SQLite backup");
  });
});
