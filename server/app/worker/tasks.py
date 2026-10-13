from app.worker.celery_app import celery_app


@celery_app.task(
    name="app.worker.tasks.health_check_task",
)
def health_check_task() -> dict[str, str]:
    """Simple task used to verify Celery worker connectivity."""

    return {
        "status": "success",
        "message": "Celery worker is processing tasks.",
    }