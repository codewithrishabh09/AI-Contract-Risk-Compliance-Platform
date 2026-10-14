from pathlib import Path

from app.services.extraction.docx import (
    DOCXExtractionError,
    extract_docx,
)
from app.services.extraction.models import ExtractedDocument
from app.services.extraction.pdf import (
    PDFExtractionError,
    extract_pdf,
)


class UnsupportedDocumentTypeError(Exception):
    """Raised when a document type is not supported."""


class DocumentExtractionError(Exception):
    """Raised when document extraction fails."""


PDF_CONTENT_TYPE = "application/pdf"

DOCX_CONTENT_TYPE = (
    "application/vnd.openxmlformats-officedocument."
    "wordprocessingml.document"
)


def extract_document(
    *,
    content: bytes,
    filename: str,
    content_type: str,
) -> ExtractedDocument:
    """
    Extract text from a supported document.

    The caller does not need to know whether the document
    is PDF or DOCX.
    """

    extension = Path(filename).suffix.lower()

    if (
        extension == ".pdf"
        and content_type == PDF_CONTENT_TYPE
    ):
        try:
            return extract_pdf(
                content=content,
                filename=filename,
                content_type=content_type,
            )
        except PDFExtractionError as exc:
            raise DocumentExtractionError(
                str(exc)
            ) from exc

    if (
        extension == ".docx"
        and content_type == DOCX_CONTENT_TYPE
    ):
        try:
            return extract_docx(
                content=content,
                filename=filename,
                content_type=content_type,
            )
        except DOCXExtractionError as exc:
            raise DocumentExtractionError(
                str(exc)
            ) from exc

    raise UnsupportedDocumentTypeError(
        "Unsupported document type."
    )