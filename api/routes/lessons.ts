import express from "express";
import type { GetLessonsResponseBody } from "../types/api.ts";
import { IS_MOCK_MODE, LANGUAGE } from "../config.ts";
import { getLessonsMock, getTranscriptionMock } from "../mocks/data.ts";
import delay from "../mocks/delay.ts";
import { getLessons } from "../db/models.ts";

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

export default router;
