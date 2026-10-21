import uuid

from app.worker.celery_app import celery_app
from app.db.session import SessionLocal
from app.repositories.contract_repository import ContractRepository
from app.services.analysis.service import (
    ContractAnalysisError,
    ContractAnalysisService,
)
from app.services.processing_service import ProcessingService


@celery_app.task(
    bind=True,
    name="app.worker.analysis_tasks.analyze_contract_task",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def analyze_contract_task(
    self,
    *,
    job_id: str,
    organization_id: str,
    contract_id: str,
    contract_version_id: str,
):
    session = SessionLocal()

    try:
        job_uuid = uuid.UUID(job_id)
        organization_uuid = uuid.UUID(organization_id)
        contract_uuid = uuid.UUID(contract_id)
        version_uuid = uuid.UUID(contract_version_id)

        job = ProcessingService.start_job(
            session,
            job_id=job_uuid,
        )

        session.commit()

        if job.status == "SUCCEEDED":
            return {
                "job_id": job_id,
                "status": "SUCCEEDED",
            }

        ContractAnalysisService.analyze(
            session,
            organization_id=organization_uuid,
            contract_id=contract_uuid,
            contract_version_id=version_uuid,
        )

        ContractRepository.update_status(
            session,
            organization_id=organization_uuid,
            contract_id=contract_uuid,
            status="ANALYZED",
        )

        ProcessingService.mark_succeeded(
            session,
            job_id=job_uuid,
        )

        session.commit()

        return {
            "job_id": job_id,
            "status": "SUCCEEDED",
        }

    except ContractAnalysisError as exc:
        session.rollback()

        ProcessingService.mark_failed(
            session,
            job_id=uuid.UUID(job_id),
            error_code="ANALYSIS_ERROR",
            error_message=str(exc),
        )

        session.commit()

        raise

    except Exception as exc:
        session.rollback()

        ProcessingService.mark_failed(
            session,
            job_id=uuid.UUID(job_id),
            error_code="UNEXPECTED_ANALYSIS_ERROR",
            error_message="Unexpected contract analysis failure.",
        )

        session.commit()

        raise

    finally:
        session.close()
