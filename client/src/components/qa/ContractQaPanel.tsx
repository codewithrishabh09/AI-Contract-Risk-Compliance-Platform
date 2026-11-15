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
import { useState, type KeyboardEvent } from "react";

import { useAskContractQuestion } from "../../features/contracts/useContractQa";

import type { RAGConversationMessage } from "../../types/rag";

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

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
  const [messages, setMessages] = useState<RAGConversationMessage[]>([]);

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

    setMessages((current) => [...current, userMessage]);
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

      setMessages((current) => [...current, assistantMessage]);
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
    <section className="mt-6 overflow-hidden rounded-[26px] border border-[#dddcd3] bg-[#fffefa] shadow-[0_16px_45px_rgba(36,48,39,0.06)]">
      {/* Header */}
      <div className="border-b border-[#e5e3da] bg-[#faf9f5] px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#9caf88]/30 bg-[#e5eadf] text-[#718060]">
              <MessageSquareText size={19} strokeWidth={1.8} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#718060]">
                  Contract Intelligence
                </span>

                <span className="rounded-full border border-[#9caf88]/35 bg-[#e5eadf] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#526047]">
                  RAG
                </span>
              </div>

              <h2 className="mt-1.5 font-['Playfair_Display'] text-xl font-medium tracking-[-0.02em] text-[#243027]">
                Ask about this contract
              </h2>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#687268]">
                Explore this contract with grounded AI answers backed by
                source citations from the selected version.
              </p>
            </div>
          </div>

          {hasConversation ? (
            <button
              type="button"
              onClick={clearConversation}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#dddcd3] bg-[#fffefa] px-3.5 py-2.5 text-[11px] font-semibold text-[#687268] transition hover:border-[#e8412c]/30 hover:bg-[#fff4f2] hover:text-[#e8412c]"
            >
              <RotateCcw size={13} />
              Clear conversation
            </button>
          ) : null}
        </div>
      </div>

      {/* Conversation */}
      <div className="min-h-[270px] bg-[#fffefa]">
        {!hasConversation ? (
          <div className="px-5 py-10 sm:px-7">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#9caf88]/30 bg-[#e5eadf] text-[#718060]">
                <Sparkles size={21} strokeWidth={1.8} />
              </div>

              <h3 className="mt-5 font-['Playfair_Display'] text-xl font-medium text-[#243027]">
                Explore your contract
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-[#687268]">
                Ask about obligations, risks, termination, liability,
                payments, renewal terms, or any other clause in the
                document.
              </p>

              <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {suggestedQuestions.map((suggestedQuestion) => (
                  <button
                    key={suggestedQuestion}
                    type="button"
                    onClick={() =>
                      handleSuggestedQuestion(suggestedQuestion)
                    }
                    className="group flex items-center justify-between rounded-xl border border-[#dddcd3] bg-[#faf9f5] px-4 py-3.5 text-left transition hover:border-[#9caf88] hover:bg-[#e5eadf]/45"
                  >
                    <span className="pr-3 text-[11px] leading-5 text-[#687268] transition group-hover:text-[#243027]">
                      {suggestedQuestion}
                    </span>

                    <ChevronRight
                      size={14}
                      className="shrink-0 text-[#9aa198] transition group-hover:translate-x-0.5 group-hover:text-[#718060]"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#e5e3da]">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`px-5 py-6 sm:px-7 ${
                    isUser ? "bg-[#fffefa]" : "bg-[#faf9f5]"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                        isUser
                          ? "border-[#dddcd3] bg-[#f4f5ef] text-[#687268]"
                          : "border-[#9caf88]/30 bg-[#e5eadf] text-[#718060]"
                      }`}
                    >
                      {isUser ? (
                        <UserRound size={15} />
                      ) : (
                        <Bot size={15} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#687268]">
                          {isUser ? "You" : "LexMind"}
                        </span>

                        {!isUser && message.model_name ? (
                          <span className="rounded-full border border-[#dddcd3] bg-[#fffefa] px-2 py-0.5 text-[8px] font-medium text-[#858d84]">
                            {message.model_provider
                              ? `${message.model_provider} · `
                              : ""}
                            {message.model_name}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2.5 whitespace-pre-wrap text-xs leading-6 text-[#526047]">
                        {message.content}
                      </p>

                      {!isUser &&
                      message.citations &&
                      message.citations.length > 0 ? (
                        <div className="mt-5">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="h-px flex-1 bg-[#e5e3da]" />

                            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#858d84]">
                              Sources
                            </span>

                            <div className="h-px flex-1 bg-[#e5e3da]" />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {message.citations.map((citation) => (
                              <div
                                key={`${message.id}-${citation.citation_id}`}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#dddcd3] bg-[#fffefa] px-2.5 py-2 shadow-[0_4px_12px_rgba(36,48,39,0.03)]"
                              >
                                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#e5eadf] text-[9px] font-bold text-[#526047]">
                                  {citation.citation_id}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <FileText
                                    size={11}
                                    className="text-[#858d84]"
                                  />

                                  <span className="text-[9px] font-medium text-[#687268]">
                                    {formatCitationLabel(
                                      citation.chunk_index,
                                      citation.page_start,
                                      citation.page_end,
                                    )}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}

            {askQuestion.isPending ? (
              <div className="bg-[#faf9f5] px-5 py-6 sm:px-7">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#9caf88]/30 bg-[#e5eadf] text-[#718060]">
                    <Bot size={15} />
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#687268]">
                      LexMind
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-[#687268]">
                      <LoaderCircle
                        size={14}
                        className="animate-spin text-[#718060]"
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
      <div className="border-t border-[#e5e3da] bg-[#faf9f5] px-5 py-5 sm:px-7">
        <div className="overflow-hidden rounded-2xl border border-[#dddcd3] bg-[#fffefa] transition focus-within:border-[#9caf88] focus-within:shadow-[0_0_0_3px_rgba(156,175,136,0.12)]">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={askQuestion.isPending}
            rows={3}
            placeholder="Ask a question about this contract..."
            className="w-full resize-none border-0 bg-transparent px-4 py-3.5 text-xs leading-5 text-[#243027] outline-none placeholder:text-[#a0a69e] disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="flex flex-col gap-2 border-t border-[#e5e3da] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[9px] text-[#9aa198]">
              Ctrl + Enter to ask
            </span>

            <button
              type="button"
              onClick={() => void handleAsk()}
              disabled={
                !question.trim() || askQuestion.isPending
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#243027] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#526047] disabled:cursor-not-allowed disabled:opacity-40"
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

        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] text-[#9aa198]">
          <span>
            Answers are grounded in the selected contract version.
          </span>
        </div>
      </div>
    </section>
  );
}