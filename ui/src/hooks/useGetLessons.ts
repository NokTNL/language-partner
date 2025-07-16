import { useQuery } from "@tanstack/react-query";
import smartFetch from "../utils/smartFetch";
import type { GetLessonsResponseBody } from "../../../api/types/api";
import { API_BASE_URL } from "../constants";

export default function useGetLessons() {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: () =>
      smartFetch<GetLessonsResponseBody>(`${API_BASE_URL}/lessons`),
  });
}
