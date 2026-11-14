import {
  useQuery,
} from "@tanstack/react-query";

import {
  getJobs,
  type GetJobsParams,
} from "../../lib/api/jobsApi";

export function useJobs(
  params: GetJobsParams,
) {
  return useQuery({
    queryKey: [
      "processing-jobs",
      params,
    ],
    queryFn: () => getJobs(params),
    staleTime: 15_000,
    refetchInterval: (query) => {
      const jobs = query.state.data?.items ?? [];

      const hasActiveJobs = jobs.some(
        (job) =>
          job.status === "QUEUED" ||
          job.status === "RUNNING",
      );

      return hasActiveJobs ? 5_000 : false;
    },
  });
}