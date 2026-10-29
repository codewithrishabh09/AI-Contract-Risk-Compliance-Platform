export type RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type AnalysisStatus =
  | "COMPLETED"
  | "NEEDS_REVIEW"
  | "FAILED";

export interface RiskFinding {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: RiskLevel | string;
  recommendation: string | null;
  evidence_text: string | null;
  page_start: number | null;
  page_end: number | null;
  confidence_score: number | null;
  status: string;
}

export interface AnalysisResult {
  id: string;
  contract_version_id: string;
  overall_risk_score: number | null;
  risk_level: RiskLevel | string;
  status: AnalysisStatus | string;
  summary: string | null;
  model_provider: string | null;
  model_name: string | null;
  prompt_version: string | null;
  findings: RiskFinding[];
}