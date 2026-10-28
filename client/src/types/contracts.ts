export interface Contract {
  id: string;
  organization_id: string;
  title: string;
  contract_type: string;
  status: string;
  effective_date: string | null;
  expiration_date: string | null;
  created_at: string;
  updated_at: string;
  risk_score: number | null;
  risk_level: string | null;
}

export interface ContractListResponse {
  items: Contract[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ContractDetail {
  id: string;
  organization_id: string;
  created_by: string;
  title: string;
  contract_type: string;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;

  risk_level?: string | null;
  risk_score?: number | null;
}

export interface ContractVersion {
  id: string;
  contract_id: string;
  version_number: number;
  uploaded_by: string;
  change_summary: string | null;
  created_at: string;
}

export interface ContractVersionListResponse {
  items: ContractVersion[];
}