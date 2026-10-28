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