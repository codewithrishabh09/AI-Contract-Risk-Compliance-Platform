from pydantic import BaseModel, ConfigDict, Field


class RAGQuestionRequest(BaseModel):
    question: str = Field(
        min_length=3,
        max_length=2000,
    )

    top_k: int = Field(
        default=5,
        ge=1,
        le=10,
    )


class Citation(BaseModel):
    citation_id: str
    chunk_index: int
    page_start: int
    page_end: int


class RAGAnswer(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    answer: str
    citations: list[Citation] = Field(default_factory=list)
    model_provider: str
    model_name: str
