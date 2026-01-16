"use client";

import { useState } from "react";
import Link from "next/link";
import Search from "@/components/search";
import type { SearchDoc } from "@/lib/search";

type OperationLink = {
  id: string;
  label: string;
  method: string;
  path: string;
};

type SpecNav = {
  key: string;
  title: string;
  groups: { title: string; items: OperationLink[] }[];
};

export function Sidebar({ specs, activeSpec, activeOp, searchDocs }: { specs: SpecNav[]; activeSpec?: string; activeOp?: string; searchDocs: SearchDoc[] }) {
  const [openSpecs, setOpenSpecs] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    specs.forEach((s) => {
      init[s.key] = s.key === activeSpec; // open active by default
    });
    return init;
  });

  const toggle = (key: string) => setOpenSpecs((prev) => ({ ...prev, [key]: !prev[key] }));

  function methodClass(method: string) {
    const m = method.toUpperCase();
    switch (m) {
      case "GET":
        return "text-emerald-400";
      case "POST":
        return "text-blue-400";
      case "PUT":
        return "text-amber-400";
      case "DELETE":
        return "text-rose-400";
      case "PATCH":
        return "text-purple-400";
      default:
        return "text-slate-400";
    }
  }

  return (
    <aside className="hidden h-fit min-w-[240px] rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 lg:block">
      <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
        <Search docs={searchDocs} />
        <div className="border-t border-slate-200 pt-4 dark:border-slate-800" />
        {specs.map((spec) => {
          const isOpen = openSpecs[spec.key] ?? false;
          return (
            <div key={spec.key} className="space-y-2">
              <button
                type="button"
                onClick={() => toggle(spec.key)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <span>{spec.title}</span>
                <span className="text-lg leading-none">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen ? (
                <div className="space-y-1">
                  {spec.groups.flatMap((group) =>
                    group.items.map((item) => (
                      <Link
                        key={item.id}
                        href={{ pathname: "/", query: { spec: spec.key, op: item.id } }}
                        className={`flex items-center justify-between rounded-md px-2 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${item.id === activeOp ? "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" : ""}`}
                      >
                        <span className="truncate">{item.label}</span>
                        <span className={`ml-2 shrink-0 text-[11px] font-bold uppercase ${methodClass(item.method)}`}>
                          {item.method}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
