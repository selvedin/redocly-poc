"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import clsx from "clsx";
import type { SearchDoc } from "@/lib/search";

export type SearchProps = {
  docs: SearchDoc[];
};

const fuseOptions: Fuse.IFuseOptions<SearchDoc> = {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  keys: [
    { name: "summary", weight: 0.5 },
    { name: "description", weight: 0.3 },
    { name: "path", weight: 0.2 },
  ],
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
    // Reset input when docs change (spec switch)
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
                <button
                  type="button"
                  className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  onClick={() => {
                    setQuery("");
                    const params = new URLSearchParams(searchParams?.toString() ?? "");
                    params.set("spec", item.specKey);
                    params.set("op", item.id);
                    router.replace(`/?${params.toString()}`, { scroll: false });
                    setTimeout(() => {
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  }}
                >
                  <span
                    className={clsx(
                      "mt-[2px] rounded px-2 py-[2px] text-[11px] font-semibold uppercase",
                      item.method === "get" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
                      item.method === "post" && "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
                      item.method === "put" && "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
                      item.method === "delete" && "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
                      item.method === "patch" && "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
                      !["get", "post", "put", "delete", "patch"].includes(item.method) && "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
                    )}
                  >
                    {item.method}
                  </span>
                  <div className="flex-1">
                    <p className="font-mono text-xs text-slate-800 dark:text-slate-200">{item.path}</p>
                    {item.summary ? (
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{item.summary}</p>
                    ) : null}
                    {item.description ? (
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{item.description}</p>
                    ) : null}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{score?.toFixed(2)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
