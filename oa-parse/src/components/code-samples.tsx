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

export default function CodeSamples({ url, method, body, authToken }: { url: string; method: string; body?: string; authToken?: string }) {
  const [lang, setLang] = useState<Language>("curl");

  const snippet = useMemo(() => generateSample(lang, { url, method, body, authToken }), [lang, url, method, body, authToken]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <label className="text-slate-600 dark:text-slate-300" htmlFor="lang-select">
          Language
        </label>
        <select
          id="lang-select"
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          value={lang}
          onChange={(e) => setLang(e.target.value as Language)}
        >
          {languages.map((l) => (
            <option key={l.key} value={l.key}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
      <pre className="max-h-96 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100 overflow-auto">
        {snippet}
      </pre>
    </div>
  );
}
