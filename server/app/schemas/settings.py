import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SettingsOrganizationResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SettingsAccountResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    email: str
    full_name: str
    role: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SettingsSecurityResponse(BaseModel):
    authentication: str
    session: str
    account_created_at: datetime


class SettingsResponse(BaseModel):
    account: SettingsAccountResponse
    organization: SettingsOrganizationResponse
    security: SettingsSecurityResponse