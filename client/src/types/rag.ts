export interface RAGQuestionRequest {
  question: string;
  top_k?: number;
}

export interface RAGCitation {
  citation_id: string;
  chunk_index: number;
  page_start: number;
  page_end: number;
}

export interface RAGAnswer {
  answer: string;
  citations: RAGCitation[];
  model_provider: string;
  model_name: string;
}