import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getSubmissions,
  getSubmissionStats,
} from "@/lib/actions/submission.action";

// export const useGetAccountStats = () => {
//   return useQuery({
//     queryKey: ["accountStats"],
//     queryFn: async () => {
//       const result = await http.get("/api/account/stats");
//       return result;
//     },
//   });
// };

export const useGetSubmissions = (
  assignmentId: string,
  page: number = 1,
  limit: number = 10,
  search?: string
) => {
  return useQuery({
    queryKey: ["submissions", assignmentId, page, limit, search],
    queryFn: () => getSubmissions(assignmentId, page, limit, search),
  });
};

export const useGetSubmissionStats = (assignmentId: string) => {
  return useQuery({
    queryKey: ["submissionStats", assignmentId],
    queryFn: () => getSubmissionStats(assignmentId),
  });
};
