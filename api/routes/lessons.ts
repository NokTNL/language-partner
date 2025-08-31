import express from "express";
import {
  SPostLessonRequestBody,
  SPutLessonRequestBody,
  type GetLessonByIdResponseBody,
  type GetLessonsResponseBody,
  type PostLessonResponseBody,
} from "../types/api.ts";
import { IS_MOCK_MODE } from "../config.ts";
import { getLessonByIdMock, getLessonsMock } from "../mocks/data.ts";
import delay from "../mocks/delay.ts";
import {
  createLesson,
  deleteLesson,
  getConversationsByLessonIds,
  getLessonById,
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

router.get<{ lessonId: string }, GetLessonByIdResponseBody | string>(
  "/lessons/:lessonId",
  async (req, res) => {
    if (IS_MOCK_MODE) {
      await delay(500);
      return res.json(getLessonByIdMock);
    }

    const { lessonId } = req.params;
    if (!lessonId) return res.status(400).send("No lessonId");

    const lesson = getLessonById(lessonId);
    const conversations = getConversationsByLessonIds([lessonId]);

    if (!lesson) return res.status(404).send("No lesson with this lessonId");

    return res.json({
      id: lesson.id,
      name: lesson.name,
      conversations,
    });
  }
);

router.post<{}, string | PostLessonResponseBody, unknown>(
  "/lessons",
  async (req, res) => {
    if (IS_MOCK_MODE) {
      await delay(500);
      return res.status(201).json({
        id: "new-lesson-id",
      });
    }

    const { name, conversations } = SPostLessonRequestBody.parse(req.body);

    const lessonId = createLesson(name, conversations);

    return res.status(201).json({ id: lessonId });
  }
);

router.put<{ lessonId: string }, string, unknown>(
  "/lessons/:lessonId",
  async (req, res) => {
    if (IS_MOCK_MODE) {
      await delay(500);
      return res.status(204).send();
    }

    const { lessonId } = req.params;
    if (!lessonId) return res.status(400).send("No lessonId");

    const { name, conversations } = SPutLessonRequestBody.parse(req.body);

    updateLesson(lessonId, name, conversations);

    return res.status(204).send();
  }
);

router.delete<{ lessonId: string }, string, never>(
  "/lessons/:lessonId",
  async (req, res) => {
    if (IS_MOCK_MODE) {
      await delay(500);
      return res.status(204).send();
    }

    const { lessonId } = req.params;
    if (!lessonId) return res.status(400).send("No lessonId");

    deleteLesson(lessonId);

    return res.status(204).send();
  }
);

export default router;
