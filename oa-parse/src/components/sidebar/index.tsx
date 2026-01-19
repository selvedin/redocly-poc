"use client";

import { useState } from "react";
import Search from "@/components/search";
import type { SidebarProps } from "@/components/sidebar/types";
import { SpecSection } from "@/components/sidebar/spec-section";

export function Sidebar({ specs, activeSpec, activeOp, searchDocs }: SidebarProps) {
  const [openSpecs, setOpenSpecs] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    specs.forEach((s) => {
      init[s.key] = s.key === activeSpec; // open active by default
    });
    return init;
  });

  const toggle = (key: string) => setOpenSpecs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <aside className="hidden h-fit min-w-[240px] rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 lg:block">
      <div className="space-y-4 text-sm text-slate-900 dark:text-slate-300">
        <Search docs={searchDocs} />
        <div className="border-t border-slate-200 pt-4 dark:border-slate-800" />
        {specs.map((spec) => {
          const isOpen = openSpecs[spec.key] ?? false;
          return (
            <SpecSection key={spec.key} spec={spec} isOpen={isOpen} activeOp={activeOp} onToggle={() => toggle(spec.key)} />
          );
        })}
      </div>
    </aside>
  );
}
