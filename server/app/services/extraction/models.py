from dataclasses import dataclass, field


@dataclass(slots=True)
class ExtractedPage:
    """Text extracted from one logical document page."""

    page_number: int
    text: str
    character_count: int


@dataclass(slots=True)
class ExtractedDocument:
    """Normalized document extraction result."""

    filename: str
    content_type: str
    pages: list[ExtractedPage] = field(default_factory=list)

    @property
    def full_text(self) -> str:
        """Return the complete document text."""

        return "\n\n".join(
            page.text
            for page in self.pages
            if page.text.strip()
        )

    @property
    def character_count(self) -> int:
        """Return total extracted character count."""

        return sum(
            page.character_count
            for page in self.pages
        )