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