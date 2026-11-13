import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.contract import Contract
from app.models.contract_version import ContractVersion
from app.models.processing_job import ProcessingJob


class ProcessingJobRepository:
    """Database operations for processing jobs."""

    @staticmethod
    def get_by_id(
        session: Session,
        *,
        job_id: uuid.UUID,
    ) -> ProcessingJob | None:
        """Get a processing job by ID."""

        statement = select(ProcessingJob).where(
            ProcessingJob.id == job_id,
        )

        return session.scalar(statement)

    @staticmethod
    def get_by_id_for_organization(
        session: Session,
        *,
        organization_id: uuid.UUID,
        job_id: uuid.UUID,
    ) -> ProcessingJob | None:
        """Get a job only when its contract belongs to the organization."""

        statement = (
            select(ProcessingJob)
            .join(
                ContractVersion,
                ContractVersion.id == ProcessingJob.contract_version_id,
            )
            .join(
                Contract,
                Contract.id == ContractVersion.contract_id,
            )
            .where(
                ProcessingJob.id == job_id,
                Contract.organization_id == organization_id,
            )
        )

        return session.scalar(statement)

    @staticmethod
    def list_for_organization(
        session: Session,
        *,
        organization_id: uuid.UUID,
        status: str | None = None,
        job_type: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[ProcessingJob], int]:
        """List processing jobs belonging to an organization."""

        base_statement = (
            select(ProcessingJob)
            .join(
                ContractVersion,
                ContractVersion.id == ProcessingJob.contract_version_id,
            )
            .join(
                Contract,
                Contract.id == ContractVersion.contract_id,
            )
            .where(
                Contract.organization_id == organization_id,
            )
        )

        if status:
            base_statement = base_statement.where(
                ProcessingJob.status == status,
            )

        if job_type:
            base_statement = base_statement.where(
                ProcessingJob.job_type == job_type,
            )

        count_statement = select(
            func.count(ProcessingJob.id),
        ).select_from(
            ProcessingJob,
        ).join(
            ContractVersion,
            ContractVersion.id == ProcessingJob.contract_version_id,
        ).join(
            Contract,
            Contract.id == ContractVersion.contract_id,
        ).where(
            Contract.organization_id == organization_id,
        )

        if status:
            count_statement = count_statement.where(
                ProcessingJob.status == status,
            )

        if job_type:
            count_statement = count_statement.where(
                ProcessingJob.job_type == job_type,
            )

        total = session.scalar(count_statement) or 0

        offset = (page - 1) * page_size

        statement = (
            base_statement
            .order_by(
                ProcessingJob.created_at.desc(),
            )
            .offset(offset)
            .limit(page_size)
        )

        jobs = list(session.scalars(statement).all())

        return jobs, total

    @staticmethod
    def create(
        session: Session,
        *,
        contract_version_id: uuid.UUID,
        requested_by: uuid.UUID,
        job_type: str = "FULL_ANALYSIS",
        status: str = "QUEUED",
    ) -> ProcessingJob:
        """Create a processing job."""

        processing_job = ProcessingJob(
            contract_version_id=contract_version_id,
            requested_by=requested_by,
            job_type=job_type,
            status=status,
        )

        session.add(processing_job)
        session.flush()

        return processing_job