import type {
  GetConversationsByLessonIdResponseBody,
  GetLessonsResponseBody,
  PostSpeechMessageResponseBody,
  PostTranscriptionResponseBody,
} from "../types/api.ts";

export const getChatMessageMock: () => PostSpeechMessageResponseBody = () => {
  return {
    id: "foo",
    isEndOfConversation: !Boolean(Math.floor(Math.random() * 3)),
    entries: [
      {
        type: "audio",
        src: "/foobar.com",
        transcription:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
    ],
  };
};

export const getTranscriptionMock: () => PostTranscriptionResponseBody = () => {
  return {
    transcription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  };
};

export const getLessonsMock: GetLessonsResponseBody = [
  {
    id: "foo",
    name: "Lesson foo",
  },
  {
    id: "bar",
    name: "Lesson bar",
  },
];

export const getConversationsByLessonIdMock: GetConversationsByLessonIdResponseBody =
  [
    {
      id: "foo",
      lessonId: "some-lesson-id",
      content: "Hi!\nBye!",
    },
    {
      id: "bar",
      lessonId: "some-lesson-id",
      content: "Hi!\nBye!\nHi again!",
    },
  ];
