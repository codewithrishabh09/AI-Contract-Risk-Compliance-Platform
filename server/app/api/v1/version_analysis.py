import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    require_permissions,
)
from app.core.permissions import Permission
from app.models.user import User
from app.schemas.version_analysis import (
    ContractRiskTrendResponse,
)
from app.services.version_analysis_service import (
    VersionAnalysisService,
)

router = APIRouter(
    prefix="/contracts",
    tags=["Contract Versions"],
)

RiskTrendViewer = Annotated[
    User,
    Depends(
        require_permissions(
            Permission.CONTRACT_READ,
            Permission.ANALYSIS_READ,
        )
    ),
]

@router.get(
    "/{contract_id}/versions/{version_id}/risk-trend", 
    response_model=ContractRiskTrendResponse,
)
def get_contract_risk_trend(
    contract_id: uuid.UUID,
    version_id: uuid.UUID, 
    current_user: RiskTrendViewer,
    session: Session = Depends(get_db),
):
    
    result = VersionAnalysisService.get_risk_trend(
        session,
        organization_id=current_user.organization_id,
        contract_id=contract_id,
        version_id=version_id, 
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract or Version not found.",
        )

    return result