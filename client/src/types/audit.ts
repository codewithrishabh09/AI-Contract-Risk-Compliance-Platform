export interface AuditLog {
  id: string;
  user_id: string | null;
  contract_id: string | null;
  contract_version_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  description: string | null;
  metadata_json: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuditSummary {
  total_events: number;
  authentication_events: number;
  contract_events: number;
  analysis_events: number;
  security_events: number;
}

export interface AuditLogListResponse {
  items: AuditLog[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  summary: AuditSummary;
}

export interface AuditFilters {
  action?: string;
  resource_type?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}