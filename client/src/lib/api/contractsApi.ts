import type {
  ContractDetail,
  ContractListResponse,
  ContractVersionListResponse,
} from "../../types/contracts";

import { apiRequest } from "./api";

export interface GetContractsParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  contract_type?: string;
  risk_level?: string;
}

export async function getContracts(
  params: GetContractsParams = {},
): Promise<ContractListResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  if (params.page_size) {
    searchParams.set(
      "page_size",
      String(params.page_size),
    );
  }

  if (params.search?.trim()) {
    searchParams.set(
      "search",
      params.search.trim(),
    );
  }

  if (params.status) {
    searchParams.set(
      "status",
      params.status,
    );
  }

  if (params.contract_type) {
    searchParams.set(
      "contract_type",
      params.contract_type,
    );
  }

  if (params.risk_level) {
    searchParams.set(
      "risk_level",
      params.risk_level,
    );
  }

  const query = searchParams.toString();

  return apiRequest<ContractListResponse>(
    `/contracts${query ? `?${query}` : ""}`,
  );
}

export async function getContract(
  contractId: string,
): Promise<ContractDetail> {
  return apiRequest<ContractDetail>(
    `/contracts/${encodeURIComponent(contractId)}`,
  );
}

export async function getContractVersions(
  contractId: string,
): Promise<ContractVersionListResponse> {
  return apiRequest<ContractVersionListResponse>(
    `/contracts/${encodeURIComponent(contractId)}/versions`,
  );
}