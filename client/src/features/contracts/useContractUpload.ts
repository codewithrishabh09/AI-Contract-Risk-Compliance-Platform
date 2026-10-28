import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  getProcessingJobStatus,
  uploadContractVersion,
} from "../../lib/api/contractUploadApi";

export function useContractUpload() {
  return useMutation({
    mutationFn: ({
      contractId,
      file,
      changeSummary,
    }: {
      contractId: string;
      file: File;
      changeSummary?: string;
    }) =>
      uploadContractVersion(
        contractId,
        file,
        changeSummary,
      ),
  });
}

export function useProcessingJob(
  jobId: string | null,
) {
  return useQuery({
    queryKey: [
      "processing-job",
      jobId,
    ],
    queryFn: () =>
      getProcessingJobStatus(jobId!),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
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