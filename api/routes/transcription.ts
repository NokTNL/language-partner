import express from "express";
import OpenAI from "openai";
import path from "path";
import fs from "fs";
import { type PostTranscriptionResponseBody } from "../types/api.ts";
import { IS_MOCK_MODE, LANGUAGE } from "../config.ts";
import { getTranscriptionMock } from "../mocks/data.ts";
import delay from "../mocks/delay.ts";

const router = express.Router();
const client = new OpenAI();

router.post<{}, PostTranscriptionResponseBody | string>(
  "/transcription",
  async (req, res) => {
    if (IS_MOCK_MODE) {
      await delay(500);
      return res.json(getTranscriptionMock());
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const audioFile = req.files.audio;
    if (Array.isArray(audioFile)) {
      return res.status(400).send("Only one file allowed at a time.");
    }
    // TODO: do not store this in public folder path, upload to server instead
    const uploadPath = path.resolve("public", audioFile.name);
    await audioFile.mv(uploadPath);

    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(uploadPath),
      model: "gpt-4o-transcribe",
      response_format: "text",
      prompt: `${LANGUAGE.localName}, or English`,
    });

    return res.status(201).json({
      transcription,
    });
  }
);

export default router;
