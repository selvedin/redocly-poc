"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import SpecHeader from "@/components/client-shell/spec-header";
import OperationList from "@/components/client-shell/operation-list";
import type { ClientShellProps } from "@/components/client-shell/types";

export default function ClientShell({
  specNav,
  specMeta,
  specOps,
  searchDocs,
  defaultSpecKey,
}: ClientShellProps) {
  const params = useSearchParams();
  const specParam = params.get("spec") ?? undefined;
  const opParam = params.get("op") ?? undefined;

  const activeKey = specParam ?? defaultSpecKey;

  const activeMeta = useMemo(() => specMeta.find((s) => s.key === activeKey), [specMeta, activeKey]);
  const activeOps = useMemo(() => specOps.find((s) => s.key === activeKey)?.ops ?? [], [specOps, activeKey]);
  const operations = useMemo(() => (opParam ? activeOps.filter((o) => o.id === opParam) : []), [activeOps, opParam]);

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar specs={specNav} activeSpec={activeKey} activeOp={opParam ?? undefined} searchDocs={searchDocs} />

      <section className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
        <SpecHeader meta={activeMeta} />
        <OperationList operations={operations} />
      </section>
    </div>
  );
}
