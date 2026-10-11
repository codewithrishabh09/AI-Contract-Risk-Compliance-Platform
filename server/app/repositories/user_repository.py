import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    @staticmethod
    def get_by_id(
        session: Session,
        user_id: uuid.UUID,
    ) -> User | None:
        statement = select(User).where(User.id == user_id)
        return session.scalar(statement)

    @staticmethod
    def get_by_email(
        session: Session,
        email: str,
    ) -> User | None:
        statement = select(User).where(User.email == email)
        return session.scalar(statement)

    @staticmethod
    def create(
        session: Session,
        *,
        organization_id: uuid.UUID,
        email: str,
        password_hash: str,
        full_name: str,
        role: str = "EMPLOYEE",
    ) -> User:
        user = User(
            organization_id=organization_id,
            email=email,
            password_hash=password_hash,
            full_name=full_name,
            role=role,
        )

        session.add(user)
        session.flush()

        return user