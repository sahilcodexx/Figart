"use client";
import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { questions } from "@/lib/site/content";

export function QuestionList({ compact = false }: { compact?: boolean }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All topics");
  const categories = [
    "All topics",
    ...new Set(questions.map((question) => question.category)),
  ];
  const filtered = questions.filter(
    (question) =>
      (category === "All topics" || question.category === category) &&
      `${question.question} ${question.answer}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  return (
    <div>
      <label className="relative flex max-w-[650px] items-center">
        <Search className="absolute left-4 size-4 text-[#999]" />
        <span className="sr-only">Search questions</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search saving, shortcuts, exports…"
          className="h-14 w-full rounded-xl border border-[#e4e6e2] bg-white pr-5 pl-11 text-base outline-none focus:border-[#147bd0] focus:ring-2 focus:ring-[#147bd0]/15"
        />
      </label>
      {!compact && (
        <div
          aria-label="Question categories"
          className="mt-5 flex flex-wrap gap-2"
        >
          {categories.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${category === value ? "border-[#147bd0] bg-[#edf6fd] text-[#147bd0]" : "border-[#e7e7e7] text-[#888] hover:bg-[#f4f4f4]"}`}
            >
              {value}
            </button>
          ))}
        </div>
      )}
      <p aria-live="polite" className="mt-6 text-xs text-[#999]">
        {filtered.length} {filtered.length === 1 ? "answer" : "answers"}
      </p>
      <div className="mt-3 rounded-xl border border-[#e9e9e7] bg-white px-5 sm:px-8">
        {filtered.map((question) => (
          <details
            key={question.question}
            name="support-question"
            className="group border-b border-[#e9e9e7] last:border-0"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-base text-[#555] outline-none focus-visible:ring-2 focus-visible:ring-[#147bd0] [&::-webkit-details-marker]:hidden">
              {question.question}
              <Plus className="size-4 shrink-0 text-[#999] group-open:hidden" />
              <X className="hidden size-4 shrink-0 text-[#999] group-open:block" />
            </summary>
            <div className="pb-6">
              <p className="mb-3 text-[10px] uppercase tracking-[0.1em] text-[#147bd0]">
                {question.category}
              </p>
              <p className="max-w-[760px] text-[15px] leading-[1.7] text-[#777]">
                {question.answer}
              </p>
            </div>
          </details>
        ))}
        {!filtered.length && (
          <div className="py-12 text-center">
            <p className="text-lg text-[#555]">No matching answers yet.</p>
            <p className="mt-2 text-sm text-[#888]">
              Try a broader term, like “save” or “canvas”.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All topics");
              }}
              className="mt-5 text-sm text-[#147bd0]"
            >
              Clear search and filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
