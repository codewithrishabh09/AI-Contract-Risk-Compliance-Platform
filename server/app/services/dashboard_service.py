import uuid

from sqlalchemy.orm import Session

from app.repositories.analysis_result_repository import (
    AnalysisResultRepository,
)
from app.repositories.risk_finding_repository import (
    RiskFindingRepository,
)
from app.repositories.contract_repository import (
    ContractRepository,
)
from app.repositories.contract_version_repository import (
    ContractVersionRepository,
)
from app.schemas.dashboard import (
    ContractDashboardResponse,
    RiskCategorySummary,
)


class DashboardService:

    @staticmethod
    def get_contract_dashboard(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        contract_version_id: uuid.UUID,
    ) -> ContractDashboardResponse | None:

        contract = ContractRepository.get_by_id(
            session,
            organization_id=organization_id,
            contract_id=contract_id,
        )

        if contract is None:
            return None

        contract_version = (
            ContractVersionRepository.get_by_id_for_contract(
                session,
                organization_id=organization_id,
                contract_id=contract_id,
                contract_version_id=contract_version_id,
            )
        )

        if contract_version is None:
            return None

        analysis_result = (
            AnalysisResultRepository.get_latest_for_dashboard(
                session,
                organization_id=organization_id,
                contract_id=contract_id,
                contract_version_id=contract_version_id,
            )
        )

        if analysis_result is None:
            return ContractDashboardResponse(
                contract_id=contract.id,
                contract_version_id=contract_version_id,
                contract_title=contract.title,
                contract_type=contract.contract_type,
                contract_status=contract.status,
                overall_risk_score=None,
                risk_level=None,
                analysis_status=None,
                total_findings=0,
                open_findings=0,
                high_risk_findings=0,
                critical_findings=0,
                categories=[],
            )

        findings = RiskFindingRepository.list_by_analysis_result(
            session,
            analysis_result_id=analysis_result.id,
        )

        total_findings = len(findings)

        open_findings = sum(
            1
            for finding in findings
            if finding.status == "OPEN"
        )

        high_risk_findings = sum(
            1
            for finding in findings
            if finding.severity == "HIGH"
        )

        critical_findings = sum(
            1
            for finding in findings
            if finding.severity == "CRITICAL"
        )

        category_rows = (
            RiskFindingRepository.get_dashboard_category_summary(
                session,
                analysis_result_id=analysis_result.id,
            )
        )

        categories = [
            RiskCategorySummary(
                category=row.category,
                total=row.total,
                low=row.low or 0,
                medium=row.medium or 0,
                high=row.high or 0,
                critical=row.critical or 0,
            )
            for row in category_rows
        ]

        return ContractDashboardResponse(
            contract_id=contract.id,
            contract_version_id=contract_version_id,
            contract_title=contract.title,
            contract_type=contract.contract_type,
            contract_status=contract.status,
            overall_risk_score=analysis_result.overall_risk_score,
            risk_level=analysis_result.risk_level,
            analysis_status=analysis_result.status,
            total_findings=total_findings,
            open_findings=open_findings,
            high_risk_findings=high_risk_findings,
            critical_findings=critical_findings,
            categories=categories,
        )
