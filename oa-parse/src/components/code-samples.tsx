"use client";

import { useMemo, useState } from "react";
import { generateSample, type Language } from "@/lib/codegen/templates";

const languages: { key: Language; label: string }[] = [
  { key: "curl", label: "curl" },
  { key: "js", label: "JavaScript" },
  { key: "python", label: "Python" },
  { key: "java", label: "Java" },
  { key: "csharp", label: "C#" },
];

export default function CodeSamples({ url, method, body }: { url: string; method: string; body?: string }) {
  const [lang, setLang] = useState<Language>("curl");

  const snippet = useMemo(() => generateSample(lang, { url, method, body }), [lang, url, method, body]);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {languages.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => setLang(l.key)}
            className={`rounded-md border px-2 py-1 text-xs ${lang === l.key ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900" : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <pre className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100 overflow-auto">
        {snippet}
      </pre>
    </div>
  );
}
