import { useQuery } from "@tanstack/react-query";
import smartFetch from "../utils/smartFetch";
import type { GetConversationsByLessonIdResponseBody } from "../../../api/types/api";
import { API_BASE_URL } from "../constants";

const concatContentDto = (data: GetConversationsByLessonIdResponseBody) => {
  return data.map(({ content }) => content).join("\n\n");
};

export default function useGetConversationsByLessonId(
  lessonId?: string | undefined
) {
  return useQuery({
    queryKey: ["conversationsByLessonId", lessonId],
    queryFn: () =>
      smartFetch<GetConversationsByLessonIdResponseBody>(
        `${API_BASE_URL}/lessons/${lessonId}/conversations`
      ),
    select: concatContentDto,
    enabled: Boolean(lessonId),
  });
}
