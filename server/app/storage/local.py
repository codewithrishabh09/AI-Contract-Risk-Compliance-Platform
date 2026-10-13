from pathlib import Path

from app.storage.base import StorageBackend, StorageError


class LocalStorage(StorageBackend):
    """Local filesystem storage for development."""

    def __init__(self, base_path: str | Path) -> None:
        self.base_path = Path(base_path)
        self.base_path.mkdir(
            parents=True,
            exist_ok=True,
        )

    def _resolve_path(
        self,
        storage_key: str,
    ) -> Path:
        path = self.base_path / storage_key

        resolved_base = self.base_path.resolve()
        resolved_path = path.resolve()

        if (
            resolved_path != resolved_base
            and resolved_base not in resolved_path.parents
        ):
            raise StorageError(
                "Invalid storage key."
            )

        return resolved_path

    def save(
        self,
        *,
        storage_key: str,
        content: bytes,
    ) -> None:
        path = self._resolve_path(storage_key)

        path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        try:
            path.write_bytes(content)
        except OSError as exc:
            raise StorageError(
                "Failed to save document."
            ) from exc

    def read(
        self,
        *,
        storage_key: str,
    ) -> bytes:
        path = self._resolve_path(storage_key)

        try:
            return path.read_bytes()
        except FileNotFoundError as exc:
            raise StorageError(
                "Stored document was not found."
            ) from exc
        except OSError as exc:
            raise StorageError(
                "Failed to read document."
            ) from exc

    def delete(
        self,
        *,
        storage_key: str,
    ) -> None:
        path = self._resolve_path(storage_key)

        try:
            if path.exists():
                path.unlink()
        except OSError as exc:
            raise StorageError(
                "Failed to delete document."
            ) from exc

    def exists(
        self,
        *,
        storage_key: str,
    ) -> bool:
        return self._resolve_path(storage_key).is_file()