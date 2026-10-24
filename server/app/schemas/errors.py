from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    detail: str = Field(
        ...,
        description="Human-readable error message.",
        examples=["Authentication required."],
    )
    request_id: str | None = Field(
        default=None,
        description="Request correlation ID for debugging and support.",
        examples=["req_01HXYZ123456"],
    )