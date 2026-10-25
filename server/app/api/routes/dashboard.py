from fastapi import APIRouter, Depends

from app.api.dependencies import DatabaseSession, require_permissions
from app.core.permissions import Permission
from app.models.user import User
from app.schemas.dashboard_overview import (
    DashboardOverviewResponse,
)
from app.services.dashboard_overview_service import (
    DashboardOverviewService,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/overview",
    response_model=DashboardOverviewResponse,
)
def get_dashboard_overview(
    db: DatabaseSession,
    current_user: User = Depends(
        require_permissions(
            Permission.CONTRACT_READ,
        )
    ),
):
    service = DashboardOverviewService(db)

    return service.get_overview(
        organization_id=current_user.organization_id,
    )