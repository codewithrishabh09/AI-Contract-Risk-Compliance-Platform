import re


def normalize_text(text: str) -> str:
    """
    Normalize extracted document text while preserving
    meaningful line boundaries.
    """

    if not text:
        return ""

    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    lines = []

    for line in text.split("\n"):
        cleaned_line = re.sub(
            r"[ \t]+",
            " ",
            line,
        ).strip()

        if cleaned_line:
            lines.append(cleaned_line)

    return "\n".join(lines)