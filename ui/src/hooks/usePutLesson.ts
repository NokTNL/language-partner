import { useMutation, useQueryClient } from "@tanstack/react-query";
import smartFetch from "../utils/smartFetch";
import { API_BASE_URL } from "../constants";
import type { PutLessonRequestBody } from "../../../api/types/api";

export default function usePutLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lessonId,
      name,
      content,
    }: {
      lessonId: string;
      name: string;
      content: string[];
    }) => {
      const body: PutLessonRequestBody = { name, content };
      return smartFetch<string>(`${API_BASE_URL}/lessons/${lessonId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    },
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["conversations", lessonId] });
    },
  });
}
