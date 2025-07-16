import { useMutation } from "@tanstack/react-query";
import smartFetch from "../utils/smartFetch";
import type {
  PostSpeechMessageRequestBody,
  PostSpeechMessageResponseBody,
} from "../../../api/types/api";
import { API_BASE_URL } from "../constants";

export default function usePostSpeech() {
  return useMutation({
    mutationFn: async (data: PostSpeechMessageRequestBody) => {
      return smartFetch<PostSpeechMessageResponseBody>(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
  });
}
