import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import CurrentUser, get_db
from app.schemas.dashboard import ContractDashboardResponse
from app.services.dashboard_service import DashboardService


router = APIRouter(
    prefix="/contracts",
    tags=["Dashboard"],
)


@router.get(
    "/{contract_id}/versions/{version_id}/dashboard",
    response_model=ContractDashboardResponse,
)
def get_contract_dashboard(
    contract_id: uuid.UUID,
    version_id: uuid.UUID,
    current_user: CurrentUser,
    session: Session = Depends(get_db),
):
    dashboard = DashboardService.get_contract_dashboard(
        session,
        organization_id=current_user.organization_id,
        contract_id=contract_id,
        contract_version_id=version_id,
    )

    if dashboard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found.",
        )

    return dashboard