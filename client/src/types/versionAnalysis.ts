export type RiskDirection =
  | "IMPROVED"
  | "WORSENED"
  | "UNCHANGED"
  | "NO_PREVIOUS_DATA";

export interface VersionRiskPoint {
  contract_version_id: string;
  version_number: number;
  overall_risk_score: number | null;
  risk_level: string | null;
  analysis_status: string | null;
  finding_count: number;
  high_risk_findings: number;
  critical_findings: number;
}

export interface ContractRiskTrend {
  contract_id: string;
  versions: VersionRiskPoint[];
  current_version_number: number | null;
  previous_version_number: number | null;
  risk_score_change: number | null;
  risk_direction: RiskDirection;
}