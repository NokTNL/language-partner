import { useEffect, useState } from "react";
import Button from "../../common/Button";
import usePutLesson from "../../hooks/usePutLesson";
import type { LessonFormValue } from "../../types/form";
import { useForm } from "react-hook-form";
import useGetConversationsByLessonId from "../../hooks/useGetConversationsByLessonId";
import useCreateLesson from "../../hooks/useCreateLesson";

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
  const { data: conversationsData } =
    useGetConversationsByLessonId(editingLessonId);
  const { mutateAsync: createLesson } = useCreateLesson();
  const { mutateAsync: putLesson, status: putLessonStatus } = usePutLesson();

  const [formStatus, setFormStatus] = useState<"success" | "error" | undefined>(
    undefined
  );

  // TODO: form validations
  const { register, handleSubmit, subscribe } = useForm<LessonFormValue>({
    values: {
      lessonName: conversationsData?.name ?? "",
      conversations: conversationsData?.conversations ?? "",
    },
  });

  const onSubmitLesson = async ({
    lessonName,
    conversations,
  }: LessonFormValue) => {
    setFormStatus(undefined);
    try {
      if (mode === "add") {
        const { id: lessonId } = await createLesson({
          name: lessonName,
          content: conversations
            .split("\n\n")
            .filter((convo) => !!convo)
            .map((convo) => convo.trim()),
        });
        onSuccessfulSubmission(lessonId);
      } else if (mode === "edit" && editingLessonId) {
        await putLesson({
          lessonId: editingLessonId,
          name: lessonName,
          content: conversations
            .split("\n\n")
            .filter((convo) => !!convo)
            .map((convo) => convo.trim()),
        });
        // TODO:  Need something here?
      }
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };

  console.log({ formStatus, mode, conversationsData });

  // Reset form status when user input data / new lesson is selected
  useEffect(() => {
    const unsbscribe = subscribe({
      callback: () => {
        setFormStatus(undefined);
      },
    });
    return unsbscribe;
  }, [subscribe]);

  /* TODO: add error handling */
  return mode === undefined ? (
    <p className="p-4">Add a new lesson, or select a lesson to edit</p>
  ) : mode === "edit" && !conversationsData ? (
    <p className="p-4">Loading...</p>
  ) : (
    <form
      className="h-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmitLesson)}
    >
      {formStatus === "success" ? (
        <div className="p-3 bg-green-100 rounded-md">
          Lesson saved successfully!
        </div>
      ) : formStatus === "error" ? (
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
        <label className="text-md font-medium" htmlFor="lesson-conversations">
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
  );
}
