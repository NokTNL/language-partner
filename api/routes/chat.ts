import express from "express";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import {
  type ExplanationOrConversation,
  SExplanationOrConversationEntries,
} from "../types/openai-schemas.ts";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import type {
  PostSpeechMessageRequestBody,
  PostSpeechMessageResponseBody,
} from "../types/api.ts";
import { getSpeechPrompt } from "../prompts/speech_template.ts";
import { CHAT_MODEL, IS_MOCK_MODE, LANGUAGE, TEMPERATURE } from "../config.ts";
import { getChatMessageMock } from "../mocks/data.ts";
import delay from "../mocks/delay.ts";
import { getConversationsByLessonIds } from "../db/models.ts";

const router = express.Router();
const client = new OpenAI();

router.post<
  {},
  PostSpeechMessageResponseBody | string,
  PostSpeechMessageRequestBody
>("/chat", async (req, res) => {
  if (IS_MOCK_MODE) {
    await delay(500);
    return res.json(getChatMessageMock());
  }
  const { user_input, previous_response_id, lessons } = req.body;
  const isFirstResponse = !user_input || !previous_response_id;

  const response = await client.responses.parse({
    model: CHAT_MODEL,
    input: [
      {
        role: isFirstResponse ? "developer" : "user",
        content: isFirstResponse
          ? getSpeechPrompt({
              listOfConversations: getConversationsByLessonIds(lessons).map(
                ({ content }) => content
              ),
              langauge: LANGUAGE,
            })
          : user_input,
      },
    ],
    previous_response_id,
    temperature: TEMPERATURE,
    text: {
      format: zodTextFormat(
        SExplanationOrConversationEntries,
        "explanation_or_conversation_entries"
      ),
    },
  });

  if (!response.output_parsed) {
    return res.status(500).send("Empty parsing output");
  }

  let responseWithFilePaths: (ExplanationOrConversation & {
    audioFilePath: string;
  })[];
  try {
    responseWithFilePaths = await Promise.all(
      response.output_parsed.entries.map(async (entry) => {
        const fileName = `${new Date()
          .toISOString()
          .replace(/\D/g, "")}${crypto.randomUUID()}.mp3`;
        const fileFullPath = path.resolve(`public/${fileName}`);
        const mp3 = await client.audio.speech.create({
          model: "gpt-4o-mini-tts",
          voice: entry.attributes.gender === "male" ? "verse" : "nova",
          input: entry.content,
          instructions:
            entry.type === "explanation"
              ? "Speak in an encouraging and positive tone"
              : "Speak very slowly, as if you are teaching someone a new language",
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(fileFullPath, buffer);
        return {
          ...entry,
          audioFilePath: fileName,
        };
      })
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(`Error creating audio files`);
  }

  return res.json({
    id: response.id,
    entries: responseWithFilePaths.map(({ audioFilePath, content }) => {
      return {
        type: "audio",
        src: `http://localhost:3156/${audioFilePath}`,
        transcription: content,
      };
    }),
    isEndOfConversation:
      !!responseWithFilePaths.at(-1)?.attributes?.isEndOfConversation,
  });
});

export default router;
