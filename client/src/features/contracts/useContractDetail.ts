import {
  useQuery,
} from "@tanstack/react-query";

import {
  getContract,
  getContractVersions,
} from "../../lib/api/contractsApi";

export function useContractDetail(
  contractId: string,
) {
  const contractQuery = useQuery({
    queryKey: [
      "contract",
      contractId,
    ],
    queryFn: () =>
      getContract(contractId),
    enabled: Boolean(contractId),
  });

  const versionsQuery = useQuery({
    queryKey: [
      "contract-versions",
      contractId,
    ],
    queryFn: () =>
      getContractVersions(contractId),
    enabled: Boolean(contractId),
  });

  return {
    contractQuery,
    versionsQuery,
  };
}