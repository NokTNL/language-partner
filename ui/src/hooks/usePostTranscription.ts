import { useMutation } from "@tanstack/react-query";
import smartFetch from "../utils/smartFetch";
import type { PostTranscriptionResponseBody } from "../../../api/types/api";
import { API_BASE_URL } from "../constants";

export default function usePostTranscription() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return smartFetch<PostTranscriptionResponseBody>(
        `${API_BASE_URL}/transcription`,
        {
          method: "POST",
          body: formData,
        }
      );
    },
  });
}
