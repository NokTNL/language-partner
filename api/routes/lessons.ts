import express from "express";
import type {
  GetConversationsByLessonIdResponseBody,
  GetLessonsResponseBody,
  PutLessonRequestBody,
} from "../types/api.ts";
import { IS_MOCK_MODE, LANGUAGE } from "../config.ts";
import {
  getConversationsByLessonIdMock,
  getLessonsMock,
  getTranscriptionMock,
} from "../mocks/data.ts";
import delay from "../mocks/delay.ts";
import {
  getConversationsByLessonId,
  getLessons,
  updateLesson,
} from "../db/models.ts";

const router = express.Router();

router.get<{}, GetLessonsResponseBody | string>(
  "/lessons",
  async (req, res) => {
    if (IS_MOCK_MODE) {
      await delay(500);
      return res.json(getLessonsMock);
    }

    const lessons = getLessons();

    return res.json(lessons);
  }
);

router.get<
  { lessonId: string },
  GetConversationsByLessonIdResponseBody | string
>("/lessons/:lessonId/conversations", async (req, res) => {
  if (IS_MOCK_MODE) {
    await delay(500);
    return res.json(getConversationsByLessonIdMock);
  }

  const { lessonId } = req.params;
  if (!lessonId) return res.status(400).send("No lessonId");

  const conversations = getConversationsByLessonId([lessonId]);

  return res.json(conversations);
});

router.put<{ lessonId: string }, string, PutLessonRequestBody>(
  "/lessons/:lessonId",
  async (req, res) => {
    if (IS_MOCK_MODE) {
      await delay(500);
      return res.status(204).send();
    }

    const { lessonId } = req.params;
    const { name, content } = req.body;
    // TODO: zod it
    if (!lessonId) return res.status(400).send("No lessonId");
    if (!name) return res.status(400).send("Missing name");
    if (!content || !Array.isArray(content))
      return res.status(400).send("Missing content array");

    updateLesson(lessonId, name, content);

    return res.status(204).send();
  }
);

export default router;
