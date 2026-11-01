import { useState } from "react";
import {
  BookOpen,
  LoaderCircle,
  MessageSquareText,
  Send,
  Sparkles,
} from "lucide-react";

import { useAskContractQuestion } from "../../features/contracts/useContractQa";

interface ContractQaPanelProps {
  contractId: string;
  versionId: string;
}

function ContractQaPanel({
  contractId,
  versionId,
}: ContractQaPanelProps) {
  const [question, setQuestion] = useState("");

  const askQuestionMutation =
    useAskContractQuestion();

  const handleAskQuestion = async () => {
    const trimmedQuestion =
      question.trim();

    if (!trimmedQuestion) {
      return;
    }

    await askQuestionMutation.mutateAsync({
      contractId,
      versionId,
      payload: {
        question: trimmedQuestion,
        top_k: 5,
      },
    });
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key === "Enter" &&
      (event.metaKey || event.ctrlKey)
    ) {
      event.preventDefault();
      void handleAskQuestion();
    }
  };

  const answer =
    askQuestionMutation.data;

  const error =
    askQuestionMutation.error;

  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-[#173052] bg-[#071426]/80">
      {/* Header */}
      <div className="border-b border-[#173052] px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-300">
            <MessageSquareText size={19} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">
                Contract Assistant
              </h2>

              <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-violet-300">
                <Sparkles size={10} />
                RAG
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Ask grounded questions about the current
              contract version and review the supporting
              citations.
            </p>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="p-5 sm:p-6">
        <label
          htmlFor="contract-question"
          className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500"
        >
          Ask about this contract
        </label>

        <div className="relative">
          <textarea
            id="contract-question"
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={
              askQuestionMutation.isPending
            }
            placeholder="e.g. What are the payment obligations of the parties?"
            rows={4}
            maxLength={2000}
            className="w-full resize-none rounded-lg border border-[#173052] bg-[#050F1D] px-4 py-3 pr-4 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-violet-400/40 focus:ring-1 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-slate-600">
            Press Ctrl + Enter to ask
          </p>

          <button
            type="button"
            onClick={() =>
              void handleAskQuestion()
            }
            disabled={
              !question.trim() ||
              askQuestionMutation.isPending
            }
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-violet-400/30 bg-violet-500/10 px-4 text-xs font-semibold text-violet-200 transition hover:border-violet-300/40 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {askQuestionMutation.isPending ? (
              <>
                <LoaderCircle
                  size={14}
                  className="animate-spin"
                />
                Thinking...
              </>
            ) : (
              <>
                <Send size={14} />
                Ask Question
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error ? (
          <div className="mt-5 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3">
            <p className="text-xs font-medium text-rose-300">
              Unable to answer the question
            </p>

            <p className="mt-1 text-[11px] leading-5 text-rose-200/60">
              {error.message ||
                "The contract assistant could not process your question."}
            </p>
          </div>
        ) : null}

        {/* Answer */}
        {answer ? (
          <div className="mt-6 rounded-xl border border-[#173052] bg-[#050F1D]/80">
            <div className="border-b border-[#173052] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen
                    size={14}
                    className="text-indigo-400"
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Answer
                  </span>
                </div>

                <span className="text-[9px] text-slate-600">
                  {answer.model_provider} ·{" "}
                  {answer.model_name}
                </span>
              </div>
            </div>

            <div className="px-4 py-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                {answer.answer}
              </p>
            </div>

            {/* Citations */}
            {answer.citations.length > 0 ? (
              <div className="border-t border-[#173052] px-4 py-4">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                  Supporting Citations
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {answer.citations.map(
                    (citation) => (
                      <div
                        key={citation.citation_id}
                        className="rounded-lg border border-[#173052] bg-[#071426] px-3 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-semibold text-indigo-300">
                            {citation.citation_id}
                          </span>

                          <span className="text-[9px] text-slate-600">
                            Chunk{" "}
                            {citation.chunk_index}
                          </span>
                        </div>

                        <p className="mt-2 text-[10px] text-slate-500">
                          Page{" "}
                          {citation.page_start}
                          {citation.page_end !==
                          citation.page_start
                            ? `–${citation.page_end}`
                            : ""}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ContractQaPanel;