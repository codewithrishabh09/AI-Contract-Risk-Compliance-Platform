import uuid
from decimal import Decimal

from sqlalchemy.orm import Session

from app.repositories.analysis_result_repository import (
    AnalysisResultRepository,
)
from app.repositories.contract_repository import (
    ContractRepository,
)
from app.repositories.contract_version_repository import (
    ContractVersionRepository,
)
from app.repositories.risk_finding_repository import (
    RiskFindingRepository,
)
from app.schemas.version_analysis import (
    ContractRiskTrendResponse,
    VersionRiskPoint,
)


class VersionAnalysisService:

    @staticmethod
    def get_risk_trend(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
    ) -> ContractRiskTrendResponse | None:

        contract = ContractRepository.get_by_id(
            session,
            organization_id=organization_id,
            contract_id=contract_id,
        )

        if contract is None:
            return None

        versions = ContractVersionRepository.list_for_contract(
            session,
            organization_id=organization_id,
            contract_id=contract_id,
        )

        analyses = (
            AnalysisResultRepository.list_for_contract_versions(
                session,
                organization_id=organization_id,
                contract_id=contract_id,
            )
        )

        latest_analysis_by_version = {}

        for analysis in analyses:
            version_id = analysis.contract_version_id

            if version_id not in latest_analysis_by_version:
                latest_analysis_by_version[version_id] = analysis

        version_points: list[VersionRiskPoint] = []

        for version in versions:
            analysis = latest_analysis_by_version.get(
                version.id,
            )

            if analysis is None:
                version_points.append(
                    VersionRiskPoint(
                        contract_version_id=version.id,
                        version_number=version.version_number,
                        overall_risk_score=None,
                        risk_level=None,
                        analysis_status=None,
                        finding_count=0,
                        high_risk_findings=0,
                        critical_findings=0,
                    )
                )
                continue

            findings = RiskFindingRepository.list_by_analysis_result(
                session,
                analysis_result_id=analysis.id,
            )

            finding_count = len(findings)

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

            version_points.append(
                VersionRiskPoint(
                    contract_version_id=version.id,
                    version_number=version.version_number,
                    overall_risk_score=analysis.overall_risk_score,
                    risk_level=analysis.risk_level,
                    analysis_status=analysis.status,
                    finding_count=finding_count,
                    high_risk_findings=high_risk_findings,
                    critical_findings=critical_findings,
                )
            )

        analyzed_versions = [
            point
            for point in version_points
            if point.overall_risk_score is not None
        ]

        if not analyzed_versions:
            return ContractRiskTrendResponse(
                contract_id=contract_id,
                versions=version_points,
                current_version_number=None,
                previous_version_number=None,
                risk_score_change=None,
                risk_direction="NO_PREVIOUS_DATA",
            )

        current = analyzed_versions[-1]

        previous = (
            analyzed_versions[-2]
            if len(analyzed_versions) >= 2
            else None
        )

        if previous is None:
            return ContractRiskTrendResponse(
                contract_id=contract_id,
                versions=version_points,
                current_version_number=current.version_number,
                previous_version_number=None,
                risk_score_change=None,
                risk_direction="NO_PREVIOUS_DATA",
            )

        current_score = Decimal(current.overall_risk_score)
        previous_score = Decimal(previous.overall_risk_score)

        change = current_score - previous_score

        if change < 0:
            direction = "IMPROVED"
        elif change > 0:
            direction = "WORSENED"
        else:
            direction = "UNCHANGED"

        return ContractRiskTrendResponse(
            contract_id=contract_id,
            versions=version_points,
            current_version_number=current.version_number,
            previous_version_number=previous.version_number,
            risk_score_change=change,
            risk_direction=direction,
        )