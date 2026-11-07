export interface ComplianceCategory {
  category: string;
  total: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface ComplianceOverview {
  contract_id: string;
  contract_version_id: string;

  contract_title: string;
  contract_type: string;
  contract_status: string;

  overall_risk_score: number | null;
  risk_level: string | null;
  analysis_status: string | null;

  total_findings: number;
  open_findings: number;
  high_risk_findings: number;
  critical_findings: number;

  categories: ComplianceCategory[];
}