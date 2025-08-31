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

app.listen(3156);
