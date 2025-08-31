import { useMutation, useQueryClient } from "@tanstack/react-query";
import smartFetch from "../utils/smartFetch";
import { API_BASE_URL } from "../constants";
import type {
  PostLessonRequestBody,
  PostLessonResponseBody,
} from "../../../api/types/api";

export default function usePostLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      conversations,
    }: {
      name: string;
      conversations: string[];
    }) => {
      const requestBody: PostLessonRequestBody = { name, conversations };
      const responseBody = await smartFetch<PostLessonResponseBody>(
        `${API_BASE_URL}/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      return responseBody;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}
