from pydantic import BaseModel, Field


class Citation(BaseModel):
    citation_id: str
    chunk_index: int
    page_start: int
    page_end: int


class RAGAnswer(BaseModel):
    answer: str
    citations: list[Citation] = Field(default_factory=list)
    model_provider: str
    model_name: str