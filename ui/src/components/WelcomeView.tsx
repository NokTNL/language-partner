import { useEffect, useState } from "react";
import Button from "../common/Button";
import useGetLessons from "../hooks/useGetLessons";
import {
  ArchiveBoxXMarkIcon,
  ArrowRightIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import useGetConversationsByLessonId from "../hooks/useGetConversationsByLessonId";
import { useForm } from "react-hook-form";
import usePutLesson from "../hooks/usePutLesson";
import type { LessonFormValue } from "../types/form";

type WelcomeViewProps = {
  handleStartLesson: (lessonIds: string[]) => void;
};

export default function WelcomeView({ handleStartLesson }: WelcomeViewProps) {
  const { data: lessonsData } = useGetLessons();
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [editingLesson, setEditingLesson] = useState<
    { id: string; name: string } | undefined
  >(undefined);
  const { data: conversationsData } = useGetConversationsByLessonId(
    editingLesson?.id
  );
  const { mutateAsync: putLesson, status: putLessonStatus } = usePutLesson();
  const [lessonFormSaveStatus, setLessonFormSaveStatus] = useState<
    "success" | "error" | undefined
  >(undefined);

  // TODO: form validations
  const { register, handleSubmit, subscribe } = useForm<LessonFormValue>({
    values: {
      lessonName: editingLesson?.name ?? "",
      conversations: conversationsData ?? "",
    },
  });

  const handleSelectLesson =
    (lessonId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelectedLessons((prev) => [...prev, lessonId]);
      } else {
        setSelectedLessons((prev) => prev.filter((id) => id !== lessonId));
      }
    };

  const onSubmitLessonChange = async ({
    lessonName,
    conversations,
  }: LessonFormValue) => {
    if (!editingLesson) return;
    try {
      await putLesson({
        lessonId: editingLesson.id,
        name: lessonName,
        content: conversations.trim().split("\n\n"),
      });
      setLessonFormSaveStatus("success");
    } catch {
      setLessonFormSaveStatus("error");
    }
  };

  const onStartLesson = () => {
    handleStartLesson(selectedLessons);
  };

  // Clear success / error messages when editing the form again
  useEffect(() => {
    const unsubscribe = subscribe({
      formState: {
        values: true,
      },
      callback: () => {
        if (lessonFormSaveStatus) setLessonFormSaveStatus(undefined);
      },
    });

    return () => unsubscribe();
  }, [subscribe, lessonFormSaveStatus]);

  return (
    <div className="w-dvw h-dvh flex">
      <div className="flex flex-col w-[300px] shadow-md">
        {lessonsData ? (
          <div className="flex flex-col h-full">
            <h2 className="font-medium text-md p-4 shadow">
              Select the lessons you want to practice:
            </h2>
            <div className="grow-1 p-4 py-2 flex flex-col overflow-scroll">
              <div className="my-2 flex flex-col">
                <Button className="flex gap-2 justify-center items-center">
                  <PlusIcon className="size-6" />
                  <span>Add a new lesson</span>
                </Button>
              </div>
              {lessonsData.map((lesson) => (
                <div key={lesson.id} className="group flex items-center gap-2">
                  <input
                    className="size-5"
                    type="checkbox"
                    id={`lesson-${lesson.id}`}
                    checked={selectedLessons.includes(lesson.id)}
                    onChange={handleSelectLesson(lesson.id)}
                  />
                  <label
                    className="text-md grow-1 p-2"
                    htmlFor={`lesson-${lesson.id}`}
                  >
                    {lesson.name}
                  </label>
                  <Button className="invisible group-hover:visible text-red-600 not-disabled:hover:bg-red-600">
                    <ArchiveBoxXMarkIcon className="size-5" />
                  </Button>
                  <Button
                    className="invisible group-hover:visible"
                    onClick={() => setEditingLesson(lesson)}
                  >
                    <ArrowRightIcon className="size-5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="p-4 flex flex-col">
              <Button
                onClick={onStartLesson}
                disabled={selectedLessons.length === 0}
                variant="solid"
              >
                Start the lesson
              </Button>
            </div>
          </div>
        ) : (
          // TODO: add error handling
          <p>Loading...</p>
        )}
      </div>
      {/* TODO: add error handling */}
      {conversationsData ? (
        <form
          className="grow-1 p-4 flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmitLessonChange)}
        >
          {lessonFormSaveStatus === "success" ? (
            <div className="p-3 bg-green-100 rounded-md">
              Lesson saved successfully!
            </div>
          ) : lessonFormSaveStatus === "error" ? (
            <div className="p-3 bg-red-100 rounded-md">
              Something went wrong when saving the lesson. Please try again.
            </div>
          ) : null}
          <div className="flex gap-3 items-center">
            <label className="text-md font-medium" htmlFor="lesson-name">
              Lesson name
            </label>
            <input
              className="grow-1 border-1 text-lg px-1 rounded"
              id="lesson-name"
              {...register("lessonName")}
            />
          </div>
          <div className="grow-1 flex flex-col gap-2">
            <label
              className="text-md font-medium"
              htmlFor="lesson-conversations"
            >
              Conversations (separated by blank lines)
            </label>
            <textarea
              className="grow-1 border-1 text-lg px-1 rounded"
              id="lesson-conversations"
              {...register("conversations")}
            />
          </div>
          <Button type="submit" disabled={putLessonStatus === "pending"}>
            {putLessonStatus === "pending" ? "Saving..." : "Save"}
          </Button>
        </form>
      ) : editingLesson ? (
        <p className="p-4">Loading...</p>
      ) : null}
    </div>
  );
}
