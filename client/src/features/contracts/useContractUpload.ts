import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProcessingJobStatus,
  uploadContractVersion,
  uploadNewContract,
} from "../../lib/api/contractUploadApi";

export function useContractUpload() {
  const queryClient =
    useQueryClient();

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

    onSuccess: async (
      response,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["contracts"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "contract",
            response.contract_version.contract_id,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "contract-versions",
            response.contract_version.contract_id,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: ["processing-jobs"],
        }),
      ]);
    },
  });
}


export function useNewContractUpload() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      contractType,
      description,
      file,
      changeSummary,
    }: {
      title: string;
      contractType: string;
      description: string;
      file: File;
      changeSummary?: string;
    }) =>
      uploadNewContract(
        title,
        contractType,
        description,
        file,
        changeSummary,
      ),

    onSuccess: async (
      response,
    ) => {
      const contractId =
        response.contract_version.contract_id;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["contracts"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["processing-jobs"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["contract", contractId],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "contract-versions",
            contractId,
          ],
        }),
      ]);
    },
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
      getProcessingJobStatus(
        jobId!,
      ),

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