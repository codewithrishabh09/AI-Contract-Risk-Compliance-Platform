import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.analysis_result import AnalysisResult
from app.models.contract import Contract
from app.models.contract_version import ContractVersion


class AnalysisResultRepository:
    @staticmethod
    def get_by_id(
        session: Session,
        *,
        analysis_result_id: uuid.UUID,
    ) -> AnalysisResult | None:
        statement = select(AnalysisResult).where(
            AnalysisResult.id == analysis_result_id,
        )

        return session.scalar(statement)

    @staticmethod
    def get_latest_for_contract_version(
        session: Session,
        *,
        contract_version_id: uuid.UUID,
    ) -> AnalysisResult | None:
        statement = (
            select(AnalysisResult)
            .where(
                AnalysisResult.contract_version_id == contract_version_id,
            )
            .order_by(AnalysisResult.created_at.desc())
            .limit(1)
        )

        return session.scalar(statement)

    @staticmethod
    def get_latest_for_organization_contract_version(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        contract_version_id: uuid.UUID,
    ) -> AnalysisResult | None:
        statement = (
            select(AnalysisResult)
            .join(
                ContractVersion,
                ContractVersion.id == AnalysisResult.contract_version_id,
            )
            .join(
                Contract,
                Contract.id == ContractVersion.contract_id,
            )
            .where(
                AnalysisResult.contract_version_id == contract_version_id,
                ContractVersion.contract_id == contract_id,
                Contract.organization_id == organization_id,
            )
            .order_by(AnalysisResult.created_at.desc())
            .limit(1)
        )

        return session.scalar(statement)

    @staticmethod
    def create(
        session: Session,
        *,
        analysis_result: AnalysisResult,
    ) -> AnalysisResult:
        session.add(analysis_result)
        session.flush()
        return analysis_result
    
    @staticmethod
    def get_latest_for_dashboard(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        contract_version_id: uuid.UUID,
    ) -> AnalysisResult | None:
        statement = (
            select(AnalysisResult)
            .join(
                ContractVersion,
                ContractVersion.id == AnalysisResult.contract_version_id,
            )
            .join(
                Contract,
                Contract.id == ContractVersion.contract_id,
            )
            .where(
                AnalysisResult.contract_version_id == contract_version_id,
                ContractVersion.contract_id == contract_id,
                Contract.organization_id == organization_id,
            )
            .order_by(AnalysisResult.created_at.desc())
            .limit(1)
        )

        return session.scalar(statement)