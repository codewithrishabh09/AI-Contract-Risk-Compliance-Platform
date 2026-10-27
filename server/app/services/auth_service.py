import uuid

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.security.jwt import create_access_token
from app.core.security.password import hash_password, verify_password
from app.repositories.user_repository import UserRepository


class AuthServiceError(Exception):
    """Base exception for authentication service errors."""


class InvalidCredentialsError(AuthServiceError):
    """Raised when authentication credentials are invalid."""


class UserAlreadyExistsError(AuthServiceError):
    """Raised when a user already exists."""


class OrganizationNotFoundError(AuthServiceError):
    """Raised when the requested organization does not exist."""


class AuthService:
    @staticmethod
    def register_user(
        session: Session,
        *,
        organization_id: uuid.UUID,
        email: str,
        password: str,
        full_name: str,
    ):
        normalized_email = email.strip().lower()
        normalized_name = full_name.strip()

        if not normalized_name:
            raise ValueError("Full name cannot be empty.")

        if UserRepository.get_by_email(
            session,
            normalized_email,
        ):
            raise UserAlreadyExistsError(
                "A user with this email already exists."
            )

        password_hash = hash_password(password)

        try:
            user = UserRepository.create(
                session,
                organization_id=organization_id,
                email=normalized_email,
                password_hash=password_hash,
                full_name=normalized_name,
                status="ACTIVE",
            )

            session.commit()
            session.refresh(user)

            return user

        except IntegrityError as exc:
            session.rollback()
            raise UserAlreadyExistsError(
                "Unable to create user. Verify the organization and email."
            ) from exc

        except SQLAlchemyError:
            session.rollback()
            raise

    @staticmethod
    def login(
        session: Session,
        *,
        email: str,
        password: str,
    ) -> str:
        normalized_email = email.strip().lower()

        user = UserRepository.get_by_email(
            session,
            normalized_email,
        )

        if user is None:
            raise InvalidCredentialsError(
                "Invalid email or password."
            )

        if user.status != "ACTIVE":
            raise InvalidCredentialsError(
                "Invalid email or password."
            )

        if not verify_password(
            password,
            user.password_hash,
        ):
            raise InvalidCredentialsError(
                "Invalid email or password."
            )

        return create_access_token(
            user_id=user.id,
            organization_id=user.organization_id,
        )