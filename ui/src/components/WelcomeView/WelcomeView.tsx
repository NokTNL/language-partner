import { useState } from "react";
import Button from "../../common/Button";
import useGetLessons from "../../hooks/useGetLessons";
import {
  ArchiveBoxXMarkIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import LessonForm from "./LessonForm";

type WelcomeViewProps = {
  handleStartLesson: (lessonIds: string[]) => void;
};

export default function WelcomeView({ handleStartLesson }: WelcomeViewProps) {
  const { data: lessonsData } = useGetLessons();
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [lessonFormMode, setLessonFormMode] = useState<
    "edit" | "add" | undefined
  >();
  const [editingLessonId, setEditingLessonId] = useState<string | undefined>(
    undefined
  );

  const handleSelectLesson =
    (lessonId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelectedLessons((prev) => [...prev, lessonId]);
      } else {
        setSelectedLessons((prev) => prev.filter((id) => id !== lessonId));
      }
    };

  const onStartLesson = () => {
    handleStartLesson(selectedLessons);
  };

  const handleSelectEditLesson = (lessonId: string) => {
    setLessonFormMode("edit");
    setEditingLessonId(lessonId);
  };

  const handleAddNewLesson = () => {
    setLessonFormMode("add");
    setEditingLessonId(undefined);
  };
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
                <Button
                  className="flex gap-2 justify-center items-center"
                  onClick={handleAddNewLesson}
                >
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
                    onClick={() => handleSelectEditLesson(lesson.id)}
                  >
                    <PencilIcon className="size-5" />
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
      <div className="p-4 grow-1">
        <LessonForm
          mode={lessonFormMode}
          editingLessonId={editingLessonId}
          // For when adding a new lesson, we don't want to add another lesson with the same name
          onSuccessfulSubmission={handleSelectEditLesson}
        />
      </div>
    </div>
  );
}
