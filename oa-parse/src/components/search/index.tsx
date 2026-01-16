"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import type { SearchDoc } from "@/lib/search";
import { fuseOptions } from "@/components/search/config";
import Button from "@/components/ui/button";
import { methodBadgeClass, navigateToResult } from "@/components/search/utils";
import { ResultDetails } from "@/components/search/result-details";

export type SearchProps = {
  docs: SearchDoc[];
};

export default function Search({ docs }: SearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const fuse = useMemo(() => new Fuse(docs, fuseOptions), [docs]);
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 12);
  }, [fuse, query]);

  useEffect(() => {
    setQuery("");
  }, [docs]);

  return (
    <div className="relative w-full max-w-xl">
      <input
        className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-800"
        placeholder="Search endpoints..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query.trim() && results.length > 0 ? (
        <div className="absolute z-20 mt-2 max-h-96 w-full overflow-auto rounded-lg border border-slate-200 bg-white/95 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {results.map(({ item, score }) => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  onClick={() => navigateToResult(router, searchParams, item, () => setQuery(""))}
                >
                  <span
                    className={methodBadgeClass(item.method)}
                  >
                    {item.method}
                  </span>
                  <ResultDetails item={item} />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{score?.toFixed(2)}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
