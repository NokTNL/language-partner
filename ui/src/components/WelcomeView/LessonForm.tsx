import { useEffect, useState } from "react";
import Button from "../../common/Button";
import usePutLesson from "../../hooks/usePutLesson";
import type { LessonFormValue } from "../../types/form";
import { useForm } from "react-hook-form";
import useGetLessonById from "../../hooks/useGetLessonById";
import usePostLesson from "../../hooks/useCreateLesson";
import useGetLessons from "../../hooks/useGetLessons";

type LessonFormProps = {
  mode: "add" | "edit" | undefined;
  editingLessonId: string | undefined;
  onSuccessfulSubmission: (lessonId: string) => void;
};

export default function LessonForm({
  mode,
  editingLessonId,
  onSuccessfulSubmission,
}: LessonFormProps) {
  const { data: lessonsData } = useGetLessons();
  const { data: lessonByIdData } = useGetLessonById(editingLessonId);
  const { mutateAsync: createLesson } = usePostLesson();
  const { mutateAsync: putLesson, status: putLessonStatus } = usePutLesson();

  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "error" | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    subscribe,
    formState: { errors },
  } = useForm<LessonFormValue>({
    values: {
      lessonName: lessonByIdData?.name ?? "",
      conversations: lessonByIdData?.conversations ?? "",
    },
  });

  const onSubmitLesson = async ({
    lessonName,
    conversations,
  }: LessonFormValue) => {
    setSubmissionStatus(undefined);
    try {
      if (mode === "add") {
        const { id: lessonId } = await createLesson({
          name: lessonName,
          conversations: conversations
            .split("\n\n")
            .filter((convo) => !!convo)
            .map((convo) => convo.trim()),
        });
        onSuccessfulSubmission(lessonId);
      } else if (mode === "edit" && editingLessonId) {
        await putLesson({
          lessonId: editingLessonId,
          name: lessonName,
          conversations: conversations
            .split("\n\n")
            .filter((convo) => !!convo)
            .map((convo) => convo.trim()),
        });
      }
      setSubmissionStatus("success");
    } catch {
      setSubmissionStatus("error");
    }
  };

  // Reset form status when user input data / new lesson is selected
  useEffect(() => {
    const unsbscribe = subscribe({
      callback: () => {
        setSubmissionStatus(undefined);
      },
    });
    return unsbscribe;
  }, [subscribe]);

  return (
    <div className="p-4 grow-1">
      {mode === undefined ? (
        <p className="p-4">Add a new lesson, or select a lesson to edit</p>
      ) : mode === "edit" && (!lessonByIdData || !lessonsData) ? (
        <p className="p-4">Loading...</p>
      ) : (
        <form
          className="h-full flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmitLesson)}
        >
          {submissionStatus === "success" ? (
            <div className="p-3 bg-green-100 rounded-md">
              Lesson saved successfully!
            </div>
          ) : submissionStatus === "error" ? (
            <div className="p-3 bg-red-100 rounded-md">
              Something went wrong when saving the lesson. Please try again.
            </div>
          ) : null}
          <div className="flex flex-col gap-3">
            <label className="text-md font-medium" htmlFor="lesson-name">
              Lesson name
            </label>
            {errors.lessonName && (
              <p className="text-red-600">{errors.lessonName.message}</p>
            )}
            <input
              className="border-1 text-lg px-1 rounded"
              id="lesson-name"
              {...register("lessonName", {
                required: "Lesson name cannot be empty",
                validate: (newlessonName) => {
                  if (
                    lessonsData?.some(
                      (lesson) =>
                        lesson.name === newlessonName &&
                        lessonByIdData?.name !== newlessonName
                    )
                  ) {
                    return `A lesson with the name ${newlessonName} already exists. Please pick a different one.`;
                  }
                },
              })}
            />
          </div>
          <div className="grow-1 flex flex-col gap-2">
            <label
              className="text-md font-medium"
              htmlFor="lesson-conversations"
            >
              Conversations (separated by blank lines)
            </label>
            {errors.conversations && (
              <p className="text-red-600">{errors.conversations.message}</p>
            )}
            <textarea
              className="grow-1 border-1 text-lg px-1 rounded"
              id="lesson-conversations"
              {...register("conversations", {
                required: "Conversations cannot be empty",
              })}
            />
          </div>
          <Button type="submit" disabled={putLessonStatus === "pending"}>
            {putLessonStatus === "pending" ? "Saving..." : "Save"}
          </Button>
        </form>
      )}
    </div>
  );
}
