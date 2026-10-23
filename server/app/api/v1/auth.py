from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import (
    CurrentUser,
    rate_limit,
    require_roles,
)
from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    UserRegister,
    UserResponse,
)
from app.services.auth_service import (
    AuthService,
    InvalidCredentialsError,
    OrganizationNotFoundError,
    UserAlreadyExistsError,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


def get_db():
    session = SessionLocal()

    try:
        yield session
    finally:
        session.close()


DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[
        Depends(
            rate_limit(
                limit=5,
                window_seconds=60,
            )
        ),
    ],
)
def register(
    payload: UserRegister,
    session: DatabaseSession,
) -> UserResponse:
    try:
        user = AuthService.register_user(
            session,
            organization_id=payload.organization_id,
            email=payload.email,
            password=payload.password,
            full_name=payload.full_name,
        )

        return UserResponse.model_validate(user)

    except OrganizationNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except UserAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post(
    "/login",
    response_model=TokenResponse,
    dependencies=[
        Depends(
            rate_limit(
                limit=10,
                window_seconds=60,
            )
        ),
    ],
)
def login(
    payload: LoginRequest,
    session: DatabaseSession,
) -> TokenResponse:
    try:
        access_token = AuthService.login(
            session,
            email=payload.email,
            password=payload.password,
        )

        return TokenResponse(
            access_token=access_token,
        )

    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: CurrentUser,
) -> UserResponse:
    return UserResponse.model_validate(current_user)


@router.get(
    "/admin-test",
    response_model=UserResponse,
)
def admin_test(
    current_user: User = Depends(
        require_roles("SUPER_ADMIN", "ORG_ADMIN")
    ),
) -> UserResponse:
    return UserResponse.model_validate(current_user)