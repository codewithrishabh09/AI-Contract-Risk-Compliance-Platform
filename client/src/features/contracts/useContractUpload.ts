import {
  useEffect,
  useRef,
} from "react";

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
        queryClient.invalidateQueries({
          queryKey: ["contracts"],
        }),

        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEY,
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
        queryClient.invalidateQueries({
          queryKey: ["contracts"],
        }),

        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEY,
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
  const queryClient = useQueryClient();

  const lastInvalidatedStatus = useRef<
    string | null
  >(null);

  const query = useQuery({
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

  useEffect(() => {
    const status = query.data?.status;

    const isTerminal =
      status === "SUCCEEDED" ||
      status === "FAILED" ||
      status === "CANCELLED";

    if (!isTerminal) {
      return;
    }

    if (
      lastInvalidatedStatus.current === status
    ) {
      return;
    }

    lastInvalidatedStatus.current = status;

    void Promise.all([
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_QUERY_KEY,
      }),

      queryClient.invalidateQueries({
        queryKey: ["contracts"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["processing-jobs"],
      }),
    ]);
  }, [
    query.data?.status,
    queryClient,
  ]);

  return query;
}