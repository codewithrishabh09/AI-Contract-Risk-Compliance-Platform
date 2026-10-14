import fitz

from app.services.extraction.models import (
    ExtractedDocument,
    ExtractedPage,
)
from app.services.extraction.normalizer import normalize_text


class PDFExtractionError(Exception):
    """Raised when PDF extraction fails."""


def extract_pdf(
    *,
    content: bytes,
    filename: str,
    content_type: str,
) -> ExtractedDocument:
    """Extract text from a PDF page by page."""

    try:
        document = fitz.open(
            stream=content,
            filetype="pdf",
        )
    except Exception as exc:
        raise PDFExtractionError(
            "Unable to open the PDF document."
        ) from exc

    pages: list[ExtractedPage] = []

    try:
        for page_index in range(document.page_count):
            page = document.load_page(page_index)

            raw_text = page.get_text("text")
            normalized_text = normalize_text(raw_text)

            pages.append(
                ExtractedPage(
                    page_number=page_index + 1,
                    text=normalized_text,
                    character_count=len(normalized_text),
                )
            )

    except Exception as exc:
        raise PDFExtractionError(
            "Failed while extracting PDF text."
        ) from exc

    finally:
        document.close()

    return ExtractedDocument(
        filename=filename,
        content_type=content_type,
        pages=pages,
    )