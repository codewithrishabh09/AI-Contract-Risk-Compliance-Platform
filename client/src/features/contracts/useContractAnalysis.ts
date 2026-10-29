import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAnalysisJobStatus,
  getLatestContractAnalysis,
  startContractAnalysis,
} from "../../lib/api/analysisApi";

export function useStartContractAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contractId,
      versionId,
    }: {
      contractId: string;
      versionId: string;
    }) =>
      startContractAnalysis(
        contractId,
        versionId,
      ),

    onSuccess: (
      _data,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey: [
          "contract-analysis",
          variables.contractId,
          variables.versionId,
        ],
      });
    },
  });
}

export function useAnalysisJob(
  jobId: string | null,
) {
  return useQuery({
    queryKey: [
      "analysis-job",
      jobId,
    ],

    queryFn: () =>
      getAnalysisJobStatus(jobId!),

    enabled: Boolean(jobId),

    refetchInterval: (
      query,
    ) => {
      const status =
        query.state.data?.status;

      if (
        status === "SUCCEEDED" ||
        status === "FAILED" ||
        status === "CANCELLED"
      ) {
        return false;
      }

      return 2000;
    },
  });
}

export function useLatestContractAnalysis(
  contractId: string,
  versionId: string | null,
) {
  return useQuery({
    queryKey: [
      "contract-analysis",
      contractId,
      versionId,
    ],

    queryFn: () =>
      getLatestContractAnalysis(
        contractId,
        versionId!,
      ),

    enabled:
      Boolean(contractId) &&
      Boolean(versionId),
  });
}