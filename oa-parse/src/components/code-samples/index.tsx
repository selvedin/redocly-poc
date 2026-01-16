"use client";

import { useMemo, useState } from "react";
import "highlight.js/styles/github-dark.css";
import { generateSample, type Language } from "@/lib/codegen/templates";
import { useHighlightedSnippet } from "@/hooks/use-highlighted-snippet";
import LanguageSelect from "@/components/code-samples/language-select";

export default function CodeSamples({ url, method, body, authToken }: { url: string; method: string; body?: string; authToken?: string }) {
  const [lang, setLang] = useState<Language>("curl");
  const snippet = useMemo(() => generateSample(lang, { url, method, body, authToken }), [lang, url, method, body, authToken]);
  const highlighted = useHighlightedSnippet(lang, snippet);

  return (
    <div className="space-y-2">
      <LanguageSelect value={lang} onChange={setLang} />
      <pre className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100 overflow-x-auto">
        <code className="hljs" dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

