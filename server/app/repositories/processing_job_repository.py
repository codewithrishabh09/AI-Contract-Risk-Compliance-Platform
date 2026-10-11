import uuid

from sqlalchemy.orm import Session

from app.models.processing_job import ProcessingJob


class ProcessingJobRepository:
    """Database operations for processing jobs."""

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