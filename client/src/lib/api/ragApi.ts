import type {
  RAGAnswer,
  RAGQuestionRequest,
} from "../../types/rag";

import { apiRequest } from "./api";

export async function askContractQuestion(
  contractId: string,
  versionId: string,
  payload: RAGQuestionRequest,
): Promise<RAGAnswer> {
  return apiRequest<RAGAnswer>(
    `/contracts/${encodeURIComponent(
      contractId,
    )}/versions/${encodeURIComponent(
      versionId,
    )}/ask`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}