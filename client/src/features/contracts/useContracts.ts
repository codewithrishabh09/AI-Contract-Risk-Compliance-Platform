import {
  useQuery,
} from "@tanstack/react-query";

import {
  getContracts,
  type GetContractsParams,
} from "../../lib/api/contractsApi";

export function useContracts(
  params: GetContractsParams,
) {
  return useQuery({
    queryKey: [
      "contracts",
      params,
    ],
    queryFn: () =>
      getContracts(params),
    staleTime: 30_000,
  });
}