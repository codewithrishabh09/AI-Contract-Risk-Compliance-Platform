import uuid

from sqlalchemy import select
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
