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

import { DASHBOARD_QUERY_KEY } from "../dashboard/useDashboard";

export function useContractUpload() {
  const queryClient = useQueryClient();

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

    onSuccess: async (response) => {
      const contractId =
        response.contract_version.contract_id;

      await Promise.all([
        // Refresh all-contracts data.
        queryClient.invalidateQueries({
          queryKey: ["contracts"],
        }),

        // Refresh organization dashboard.
        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEY,
        }),

        // Refresh selected contract.
        queryClient.invalidateQueries({
          queryKey: ["contract", contractId],
        }),

        // Refresh contract versions.
        queryClient.invalidateQueries({
          queryKey: [
            "contract-versions",
            contractId,
          ],
        }),

        // Refresh processing jobs.
        queryClient.invalidateQueries({
          queryKey: ["processing-jobs"],
        }),
      ]);
    },
  });
}


export function useNewContractUpload() {
  const queryClient = useQueryClient();

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

    onSuccess: async (response) => {
      const contractId =
        response.contract_version.contract_id;

      await Promise.all([
        // New contract changes total contract count.
        queryClient.invalidateQueries({
          queryKey: ["contracts"],
        }),

        // New contract must immediately appear
        // in dashboard metrics/recent contracts.
        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEY,
        }),

        // Refresh the newly created contract.
        queryClient.invalidateQueries({
          queryKey: ["contract", contractId],
        }),

        // Refresh its versions.
        queryClient.invalidateQueries({
          queryKey: [
            "contract-versions",
            contractId,
          ],
        }),

        // Refresh processing jobs.
        queryClient.invalidateQueries({
          queryKey: ["processing-jobs"],
        }),
      ]);
    },
  });
}


export function useProcessingJob(
  jobId: string | null,
) {
  return useQuery({
    queryKey: ["processing-job", jobId],

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

      return 2_000;
    },
  });
}