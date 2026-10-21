import uuid
from datetime import datetime

from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    id: uuid.UUID

    user_id: uuid.UUID | None

    contract_id: uuid.UUID | None

    contract_version_id: uuid.UUID | None

    action: str
    resource_type: str
    resource_id: uuid.UUID | None

    description: str | None

    metadata_json: dict | None

    created_at: datetime