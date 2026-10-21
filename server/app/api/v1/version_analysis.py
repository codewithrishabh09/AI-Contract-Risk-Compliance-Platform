import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import CurrentUser, get_db
from app.schemas.version_analysis import (
    ContractRiskTrendResponse,
)
from app.services.version_analysis_service import (
    VersionAnalysisService,
)


router = APIRouter(
    prefix="/contracts",
    tags=["Version Analysis"],
)


@router.get(
    "/{contract_id}/risk-trend",
    response_model=ContractRiskTrendResponse,
)
def get_contract_risk_trend(
    contract_id: uuid.UUID,
    current_user: CurrentUser,
    session: Session = Depends(get_db),
):
    result = VersionAnalysisService.get_risk_trend(
        session,
        organization_id=current_user.organization_id,
        contract_id=contract_id,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found.",
        )

    return result