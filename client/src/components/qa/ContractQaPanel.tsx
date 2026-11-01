import {
  useState,
  type KeyboardEvent,
} from "react";

import {
  Bot,
  ChevronRight,
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
    <section className="mt-5 overflow-hidden rounded-xl border border-[#173052] bg-[#071426]/80">
      {/* Header */}
      <div className="border-b border-[#173052] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
              <MessageSquareText
                size={18}
                className="text-indigo-300"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-400">
                  Contract Intelligence
                </span>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-300">
                  RAG
                </span>
              </div>

              <h2 className="mt-1 text-sm font-semibold text-white">
                Ask about this contract
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                Ask follow-up questions and explore the
                contract using grounded answers with source
                citations.
              </p>
            </div>
          </div>

          {hasConversation ? (
            <button
              type="button"
              onClick={clearConversation}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#173052] bg-[#0B1930] px-3 py-2 text-[11px] font-medium text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-300"
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
          <div className="px-5 py-8 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                <Sparkles
                  size={19}
                  className="text-indigo-300"
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-200">
                Explore your contract
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-600">
                Ask about obligations, risks, termination,
                liability, payments, renewal terms, or any
                other clause in the document.
              </p>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
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
                      className="group flex items-center justify-between rounded-lg border border-[#173052] bg-[#0B1930]/70 px-3 py-3 text-left transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.04]"
                    >
                      <span className="text-[11px] leading-5 text-slate-400 transition group-hover:text-slate-200">
                        {suggestedQuestion}
                      </span>

                      <ChevronRight
                        size={14}
                        className="shrink-0 text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-indigo-300"
                      />
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#102744]">
            {messages.map((message) => {
              const isUser =
                message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`px-5 py-5 sm:px-6 ${
                    isUser
                      ? "bg-transparent"
                      : "bg-[#08172B]/45"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                        isUser
                          ? "border-slate-700 bg-slate-800/70"
                          : "border-indigo-500/20 bg-indigo-500/10"
                      }`}
                    >
                      {isUser ? (
                        <UserRound
                          size={14}
                          className="text-slate-400"
                        />
                      ) : (
                        <Bot
                          size={14}
                          className="text-indigo-300"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {isUser
                            ? "You"
                            : "LexMind"}
                        </span>

                        {!isUser &&
                        message.model_name ? (
                          <span className="text-[9px] text-slate-700">
                            {message.model_provider
                              ? `${message.model_provider} · `
                              : ""}
                            {message.model_name}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-slate-300">
                        {message.content}
                      </p>

                      {!isUser &&
                      message.citations &&
                      message.citations.length > 0 ? (
                        <div className="mt-4">
                          <div className="mb-2 flex items-center gap-2">
                            <div className="h-px flex-1 bg-[#173052]" />

                            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                              Sources
                            </span>

                            <div className="h-px flex-1 bg-[#173052]" />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {message.citations.map(
                              (citation) => (
                                <div
                                  key={`${message.id}-${citation.citation_id}`}
                                  className="inline-flex items-center gap-2 rounded-lg border border-[#173052] bg-[#0B1930] px-2.5 py-2"
                                >
                                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/10 text-[9px] font-bold text-indigo-300">
                                    {citation.citation_id}
                                  </span>

                                  <span className="text-[9px] text-slate-500">
                                    {formatCitationLabel(
                                      citation.chunk_index,
                                      citation.page_start,
                                      citation.page_end,
                                    )}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}

            {askQuestion.isPending ? (
              <div className="bg-[#08172B]/45 px-5 py-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                    <Bot
                      size={14}
                      className="text-indigo-300"
                    />
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      LexMind
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <LoaderCircle
                        size={14}
                        className="animate-spin text-indigo-300"
                      />
                      Analyzing the contract...
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-[#173052] bg-[#061222]/70 px-5 py-4 sm:px-6">
        <div className="rounded-xl border border-[#173052] bg-[#0B1930]/80 transition focus-within:border-indigo-500/30">
          <textarea
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={askQuestion.isPending}
            rows={3}
            placeholder="Ask a question about this contract..."
            className="w-full resize-none border-0 bg-transparent px-4 py-3 text-xs leading-5 text-slate-200 outline-none placeholder:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="flex items-center justify-between border-t border-[#173052] px-3 py-2">
            <span className="text-[9px] text-slate-700">
              Ctrl + Enter to ask
            </span>

            <button
              type="button"
              onClick={() => void handleAsk()}
              disabled={
                !question.trim() ||
                askQuestion.isPending
              }
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-[10px] font-semibold text-indigo-300 transition hover:border-indigo-500/40 hover:bg-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-40"
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

        <div className="mt-2 flex items-center justify-center gap-1.5 text-[9px] text-slate-700">
          <span>
            Answers are grounded in the selected
            contract version.
          </span>
        </div>
      </div>
    </section>
  );
}