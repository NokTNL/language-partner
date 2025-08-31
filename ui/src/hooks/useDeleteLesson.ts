import { useMutation, useQueryClient } from "@tanstack/react-query";
import smartFetch from "../utils/smartFetch";
import { API_BASE_URL } from "../constants";

export default function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lessonId: string) => {
      return smartFetch<string>(`${API_BASE_URL}/lessons/${lessonId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}
