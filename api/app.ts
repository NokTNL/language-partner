import express from "express";
import chatRoute from "./routes/chat.ts";
import getTranscriptionRoute from "./routes/transcription.ts";
import lessonsRoute from "./routes/lessons.ts";
import fileUpload from "express-fileupload";
import cors from "cors";
import { dbInit } from "./db/scripts.ts";
import fs from "fs/promises";
import path from "path";

dbInit();
// TODO: may not need this if using a server
// Create `/public` if not already exists, and clean up the folder
try {
  await fs.stat(path.resolve("public"));
} catch {
  await fs.mkdir(path.resolve("public"));
}
for (const file of await fs.readdir(path.resolve("public"))) {
  await fs.unlink(path.resolve("public", file));
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
// TODO: may not need this if using a server
app.use(express.static("public"));
app.use(chatRoute);
app.use(getTranscriptionRoute);
app.use(lessonsRoute);

app.listen(3156);
