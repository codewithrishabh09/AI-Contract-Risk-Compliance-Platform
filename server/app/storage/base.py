from abc import ABC, abstractmethod


class StorageError(Exception):
    """Base exception for storage-related failures."""


class StorageBackend(ABC):
    """Abstract interface for document storage."""

    @abstractmethod
    def save(
        self,
        *,
        storage_key: str,
        content: bytes,
    ) -> None:
        """Store file content using the given storage key."""
        raise NotImplementedError

    @abstractmethod
    def delete(
        self,
        *,
        storage_key: str,
    ) -> None:
        """Delete a stored file."""
        raise NotImplementedError

    @abstractmethod
    def exists(
        self,
        *,
        storage_key: str,
    ) -> bool:
        """Check whether a stored file exists."""
        raise NotImplementedError