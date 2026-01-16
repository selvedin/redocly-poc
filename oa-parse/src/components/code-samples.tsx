"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import "highlight.js/styles/github-dark.css";
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
  const [highlighted, setHighlighted] = useState<string>("");
  const hljsRef = useRef<any>(null);

  const snippet = useMemo(() => generateSample(lang, { url, method, body, authToken }), [lang, url, method, body, authToken]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!hljsRef.current) {
        const hljs = (await import("highlight.js/lib/core")).default;
        const map: Record<Language, string> = {
          curl: "bash",
          js: "javascript",
          python: "python",
          java: "java",
          csharp: "csharp",
        };
        const languages = await Promise.all([
          import("highlight.js/lib/languages/bash"),
          import("highlight.js/lib/languages/javascript"),
          import("highlight.js/lib/languages/python"),
          import("highlight.js/lib/languages/java"),
          import("highlight.js/lib/languages/csharp"),
        ]);
        hljs.registerLanguage("bash", languages[0].default);
        hljs.registerLanguage("javascript", languages[1].default);
        hljs.registerLanguage("python", languages[2].default);
        hljs.registerLanguage("java", languages[3].default);
        hljs.registerLanguage("csharp", languages[4].default);
        hljsRef.current = { hljs, map };
      }
      const { hljs, map } = hljsRef.current as { hljs: any; map: Record<Language, string> };
      const langName = map[lang] ?? "plaintext";
      try {
        const res = hljs.highlight(snippet, { language: langName });
        if (!cancelled) setHighlighted(res.value);
      } catch {
        if (!cancelled) setHighlighted(snippet);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [snippet, lang]);

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
      <pre className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100 overflow-x-auto">
        <code className="hljs" dangerouslySetInnerHTML={{ __html: highlighted || snippet }} />
      </pre>
    </div>
  );
}
