"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Language } from "@/lib/codegen/templates";
import { languageOptions, highlightMap } from "@/config/code-samples";

export function useHighlightedSnippet(lang: Language, snippet: string) {
  const [highlighted, setHighlighted] = useState<string>("");
  const hljsRef = useRef<{ hljs: any; loadedKeys: Set<string> } | null>(null);

  const langHighlight = useMemo(() => highlightMap[lang] ?? "plaintext", [lang]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!hljsRef.current) {
        const hljs = (await import("highlight.js/lib/core")).default;
        hljsRef.current = { hljs, loadedKeys: new Set<string>() };
      }
      const registry = hljsRef.current!;
      const option = languageOptions.find((o) => o.key === lang);
      if (option && !registry.loadedKeys.has(option.highlight)) {
        const mod = await option.loader();
        registry.hljs.registerLanguage(option.highlight, mod.default);
        registry.loadedKeys.add(option.highlight);
      }
      try {
        const res = registry.hljs.highlight(snippet, { language: langHighlight });
        if (!cancelled) setHighlighted(res.value);
      } catch {
        if (!cancelled) setHighlighted(snippet);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [snippet, lang, langHighlight]);

  return highlighted || snippet;
}

