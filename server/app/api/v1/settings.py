from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import CurrentUser
from app.db.session import get_db
from app.models.organization import Organization
from app.schemas.settings import (
    SettingsAccountResponse,
    SettingsOrganizationResponse,
    SettingsResponse,
    SettingsSecurityResponse,
)

router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


@router.get(
    "",
    response_model=SettingsResponse,
    status_code=status.HTTP_200_OK,
)
def get_settings(
    current_user: CurrentUser,
    session: Session = Depends(get_db),
) -> SettingsResponse:
    organization = session.get(
        Organization,
        current_user.organization_id,
    )

    if organization is None:
        raise ValueError("Organization not found.")

    return SettingsResponse(
        account=SettingsAccountResponse.model_validate(
            current_user,
        ),
        organization=SettingsOrganizationResponse.model_validate(
            organization,
        ),
        security=SettingsSecurityResponse(
            authentication="JWT",
            session="Authenticated",
            account_created_at=current_user.created_at,
        ),
    )