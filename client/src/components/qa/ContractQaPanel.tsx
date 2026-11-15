import {
  useState,
  type KeyboardEvent,
} from "react";

import {
  Bot,
  ChevronRight,
  FileText,
  LoaderCircle,
  MessageSquareText,
  RotateCcw,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useAskContractQuestion } from "../../features/contracts/useContractQa";

import type {
  RAGConversationMessage,
} from "../../types/rag";

interface ContractQaPanelProps {
  contractId: string;
  versionId: string;
}

const suggestedQuestions = [
  "What are the payment obligations?",
  "What are the termination conditions?",
  "What are the liability provisions?",
  "What are the renewal terms?",
];

function createMessageId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function formatCitationLabel(
  chunkIndex: number,
  pageStart: number,
  pageEnd: number,
): string {
  if (pageStart === pageEnd) {
    return `Page ${pageStart} · Chunk ${chunkIndex}`;
  }

  return `Pages ${pageStart}-${pageEnd} · Chunk ${chunkIndex}`;
}

function getModelLabel(
  provider: string | null | undefined,
  model: string | null | undefined,
): string | null {
  if (!model) {
    return null;
  }

  if (provider) {
    return `${provider} · ${model}`;
  }

  return model;
}

export default function ContractQaPanel({
  contractId,
  versionId,
}: ContractQaPanelProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    RAGConversationMessage[]
  >([]);

  const askQuestion = useAskContractQuestion();

  const handleAsk = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || askQuestion.isPending) {
      return;
    }

    askQuestion.reset();

    const userMessage: RAGConversationMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setQuestion("");

    try {
      const response = await askQuestion.mutateAsync({
        contractId,
        versionId,
        payload: {
          question: trimmedQuestion,
          top_k: 5,
        },
      });

      const assistantMessage: RAGConversationMessage = {
        id: createMessageId(),
        role: "assistant",
        content: response.answer,
        citations: response.citations,
        model_provider: response.model_provider,
        model_name: response.model_name,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch {
      const assistantErrorMessage: RAGConversationMessage = {
        id: createMessageId(),
        role: "assistant",
        content:
          "I couldn't generate an answer for this question. Please try again.",
      };

      setMessages((current) => [
        ...current,
        assistantErrorMessage,
      ]);
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key === "Enter" &&
      (event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault();
      void handleAsk();
    }
  };

  const handleSuggestedQuestion = (
    suggestedQuestion: string,
  ) => {
    setQuestion(suggestedQuestion);
  };

  const clearConversation = () => {
    askQuestion.reset();
    setMessages([]);
    setQuestion("");
  };

  const hasConversation = messages.length > 0;

  return (
    <section className="mt-6 overflow-hidden rounded-[26px] border border-[#dddcd3] bg-[#fffefa] shadow-[0_18px_50px_rgba(36,48,39,0.06)]">
      {/* Header */}
      <div className="border-b border-[#e5e3da] px-6 py-6 sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#cbd8c2] bg-[#e5eadf] text-[#718060]">
              <MessageSquareText size={19} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718060]">
                  Contract Intelligence
                </span>

                <span className="rounded-full border border-[#cbd8c2] bg-[#f0f4eb] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#718060]">
                  RAG
                </span>
              </div>

              <h2 className="mt-1.5 font-['Playfair_Display'] text-[21px] font-medium text-[#243027]">
                Ask about this contract
              </h2>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#7a8279]">
                Explore this contract with grounded AI answers
                backed by source citations from the selected
                version.
              </p>
            </div>
          </div>

          {hasConversation ? (
            <button
              type="button"
              onClick={clearConversation}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#dddcd3] bg-[#fffefa] px-3.5 py-2 text-[11px] font-semibold text-[#687268] transition hover:border-[#c8c8bd] hover:bg-[#f7f5ef] hover:text-[#243027]"
            >
              <RotateCcw size={13} />
              Clear conversation
            </button>
          ) : null}
        </div>
      </div>

      {/* Conversation */}
      <div className="min-h-[260px]">
        {!hasConversation ? (
          <div className="px-6 py-10 sm:px-7">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#cbd8c2] bg-[#e5eadf] text-[#718060]">
                <Sparkles size={19} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-[#243027]">
                Explore your contract
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-[#858d84]">
                Ask about obligations, risks, termination,
                liability, payments, renewal terms, or any
                other clause in the document.
              </p>

              <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {suggestedQuestions.map(
                  (suggestedQuestion) => (
                    <button
                      key={suggestedQuestion}
                      type="button"
                      onClick={() =>
                        handleSuggestedQuestion(
                          suggestedQuestion,
                        )
                      }
                      className="group flex items-center justify-between rounded-xl border border-[#e2e1d9] bg-[#faf9f5] px-4 py-3.5 text-left transition hover:border-[#cbd8c2] hover:bg-[#f3f6ef]"
                    >
                      <span className="text-[11px] leading-5 text-[#687268] transition group-hover:text-[#243027]">
                        {suggestedQuestion}
                      </span>

                      <ChevronRight
                        size={14}
                        className="shrink-0 text-[#a0a69e] transition group-hover:translate-x-0.5 group-hover:text-[#718060]"
                      />
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#e8e6de]">
            {messages.map((message) => {
              const isUser =
                message.role === "user";

              const modelLabel = getModelLabel(
                message.model_provider,
                message.model_name,
              );

              return (
                <div
                  key={message.id}
                  className="px-6 py-6 sm:px-7"
                >
                  {isUser ? (
                    /* User message */
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#dddcd3] bg-[#f7f5ef] text-[#687268]">
                        <UserRound size={15} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#858d84]">
                            You
                          </span>
                        </div>

                        <div className="mt-2.5 inline-block max-w-[90%] rounded-2xl rounded-tl-md border border-[#e2e1d9] bg-[#f7f5ef] px-4 py-3">
                          <p className="whitespace-pre-wrap text-xs leading-6 text-[#3e493f]">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* LexMind response */
                    <div className="relative overflow-hidden rounded-2xl border border-[#dfe5d9] bg-[#f7f9f4]">
                      <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#9caf88]" />

                      <div className="p-5 pl-6 sm:p-6 sm:pl-7">
                        {/* AI header */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#cbd8c2] bg-[#e5eadf] text-[#718060]">
                              <Bot size={15} />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#526047]">
                                  LexMind
                                </span>

                                <span className="rounded-full border border-[#d6dfcf] bg-[#fffefa] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#7a8574]">
                                  AI Answer
                                </span>
                              </div>

                              {modelLabel ? (
                                <p className="mt-1 text-[9px] text-[#98a097]">
                                  {modelLabel}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* Answer */}
                        <div className="mt-5">
                          <p className="whitespace-pre-wrap text-[13px] leading-7 text-[#3e493f]">
                            {message.content}
                          </p>
                        </div>

                        {/* Sources */}
                        {message.citations &&
                        message.citations.length > 0 ? (
                          <div className="mt-6 border-t border-[#dfe5d9] pt-5">
                            <div className="mb-3 flex items-center gap-2">
                              <FileText
                                size={13}
                                className="text-[#718060]"
                              />

                              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#718060]">
                                Evidence from contract
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {message.citations.map(
                                (citation) => (
                                  <div
                                    key={`${message.id}-${citation.citation_id}`}
                                    className="group inline-flex items-center gap-2 rounded-xl border border-[#dfe5d9] bg-[#fffefa] px-3 py-2 shadow-[0_2px_8px_rgba(36,48,39,0.03)]"
                                  >
                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e5eadf] text-[9px] font-bold text-[#718060]">
                                      {citation.citation_id}
                                    </span>

                                    <div>
                                      <p className="text-[10px] font-semibold text-[#526047]">
                                        {formatCitationLabel(
                                          citation.chunk_index,
                                          citation.page_start,
                                          citation.page_end,
                                        )}
                                      </p>

                                      <p className="mt-0.5 text-[8px] text-[#9aa197]">
                                        Contract source
                                      </p>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {askQuestion.isPending ? (
              <div className="px-6 py-6 sm:px-7">
                <div className="relative overflow-hidden rounded-2xl border border-[#dfe5d9] bg-[#f7f9f4]">
                  <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#9caf88]" />

                  <div className="flex items-center gap-3 p-5 pl-6">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#cbd8c2] bg-[#e5eadf] text-[#718060]">
                      <Bot size={15} />
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#526047]">
                        LexMind
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs text-[#7a8279]">
                        <LoaderCircle
                          size={14}
                          className="animate-spin text-[#718060]"
                        />

                        Analyzing the contract...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-[#e5e3da] bg-[#faf9f5] px-6 py-5 sm:px-7">
        <div className="overflow-hidden rounded-2xl border border-[#dddcd3] bg-[#fffefa] shadow-[0_4px_18px_rgba(36,48,39,0.03)] transition focus-within:border-[#b9c7ae] focus-within:shadow-[0_5px_20px_rgba(113,128,96,0.08)]">
          <textarea
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={askQuestion.isPending}
            rows={3}
            placeholder="Ask a question about this contract..."
            className="w-full resize-none border-0 bg-transparent px-4 py-4 text-xs leading-6 text-[#243027] outline-none placeholder:text-[#a1a8a0] disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="flex items-center justify-between border-t border-[#e8e6de] px-3 py-2.5">
            <span className="text-[9px] text-[#a0a69e]">
              Ctrl + Enter to ask
            </span>

            <button
              type="button"
              onClick={() => void handleAsk()}
              disabled={
                !question.trim() ||
                askQuestion.isPending
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#718060] px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#617050] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {askQuestion.isPending ? (
                <LoaderCircle
                  size={13}
                  className="animate-spin"
                />
              ) : (
                <Send size={13} />
              )}

              Ask Question
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-center text-[9px] text-[#9aa197]">
          Answers are grounded in the selected contract
          version.
        </div>
      </div>
    </section>
  );
}