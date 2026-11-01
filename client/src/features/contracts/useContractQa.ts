import { useMutation } from "@tanstack/react-query";

import {
  askContractQuestion,
} from "../../lib/api/ragApi";

import type {
  RAGAnswer,
  RAGQuestionRequest,
} from "../../types/rag";

interface AskContractQuestionVariables {
  contractId: string;
  versionId: string;
  payload: RAGQuestionRequest;
}

export function useAskContractQuestion() {
  return useMutation<
    RAGAnswer,
    Error,
    AskContractQuestionVariables
  >({
    mutationFn: ({
      contractId,
      versionId,
      payload,
    }) =>
      askContractQuestion(
        contractId,
        versionId,
        payload,
      ),
  });
}