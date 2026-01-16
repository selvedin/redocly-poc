import { useMemo, useState } from "react";
import SchemaTree from "@/components/schema-tree";
import type { ResponseInfo } from "@/lib/openapi/load";

function statusTone(status?: string) {
  if (!status) return "blue";
  if (status.startsWith("2")) return "green";
  if (status.startsWith("3")) return "blue";
  if (status.startsWith("4")) return "amber";
  if (status.startsWith("5")) return "red";
  return "blue";
}

function tabClasses(active: boolean, tone: string) {
  const base = "rounded border px-2 py-1 transition text-xs";
  if (active) {
    switch (tone) {
      case "green":
        return `${base} border-green-600 bg-green-600 text-white dark:border-green-400 dark:bg-green-400 dark:text-slate-900`;
      case "amber":
        return `${base} border-amber-600 bg-amber-600 text-white dark:border-amber-400 dark:bg-amber-400 dark:text-slate-900`;
      case "red":
        return `${base} border-rose-600 bg-rose-600 text-white dark:border-rose-400 dark:bg-rose-400 dark:text-slate-900`;
      default:
        return `${base} border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900`;
    }
  }
  switch (tone) {
    case "green":
      return `${base} border-green-200 bg-white text-green-700 hover:bg-green-50 dark:border-green-700 dark:bg-slate-900 dark:text-green-300 dark:hover:bg-slate-800`;
    case "amber":
      return `${base} border-amber-200 bg-white text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-slate-800`;
    case "red":
      return `${base} border-rose-200 bg-white text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-slate-800`;
    default:
      return `${base} border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`;
  }
}

export default function ResponseView({ responses, expandAll = false }: { responses: ResponseInfo[]; expandAll?: boolean }) {
  const [activeStatus, setActiveStatus] = useState(responses[0]?.status);
  const active = useMemo(() => responses.find((r) => r.status === activeStatus) ?? responses[0], [responses, activeStatus]);

  if (!responses.length) return null;
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Responses</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {responses.map((resp) => {
            const tone = statusTone(resp.status);
            const isActive = active?.status === resp.status;
            return (
              <button
                key={resp.status}
                type="button"
                onClick={() => setActiveStatus(resp.status)}
                className={tabClasses(isActive, tone)}
              >
                {resp.status}
              </button>
            );
          })}
        </div>
      </div>

      {active ? (
        <div className="rounded-lg border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-800 dark:text-slate-100">{active.status}</span>
            <div className="flex items-center gap-2">
              {active.contentType ? (
                <span className="rounded bg-slate-100 px-2 py-[2px] text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {active.contentType}
                </span>
              ) : null}
              {active.description ? <span className="text-xs text-slate-500 dark:text-slate-400">{active.description}</span> : null}
            </div>
          </div>
          {active.schema ? (
            <div className="mt-2">
              <SchemaTree schema={active.schema} expandAll={expandAll} />
            </div>
          ) : null}
          {active.example ? (
            <pre className="mt-2 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100">
              {active.example}
            </pre>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
