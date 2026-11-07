export interface DashboardRiskDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface DashboardTrendPoint {
  date: string;
  risk_score: number;
}

export interface DashboardRecentContract {
  id: string;
  title: string;
  contract_type: string;
  status: string;
  risk_score: number | null;
  risk_level: string | null;
  updated_at: string;
}

export interface DashboardOverview {
  total_contracts: number;
  high_risk_contracts: number;
  critical_findings: number;
  pending_analysis: number;
  risk_distribution: DashboardRiskDistribution;
  risk_trend: DashboardTrendPoint[];
  recent_contracts: DashboardRecentContract[];
}

export interface RiskCategorySummary {
  category: string;
  total: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface ContractDashboard {
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

  categories: RiskCategorySummary[];
}