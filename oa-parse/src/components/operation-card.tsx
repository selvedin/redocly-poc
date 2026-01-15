import clsx from "clsx";
import type { Operation } from "@/lib/openapi/load";
import OperationDetail from "@/components/operation-detail";

const methodColors: Record<string, string> = {
  get: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  post: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
  put: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  delete: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
  patch: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
  default: "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-200",
};

export function OperationCard({ op }: { op: Operation }) {
  const color = methodColors[op.method] ?? methodColors.default;

  return (
    <article
      id={op.id}
      className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
    >
      <div className="flex items-start gap-3">
        <span className={clsx("mt-1 rounded-md px-2 py-1 text-xs font-semibold uppercase", color)}>
          {op.method}
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-sm text-slate-800 dark:text-slate-100">{op.path}</p>
            <a href={`#${op.id}`} className="text-xs text-slate-500 underline-offset-4 hover:underline">
              #
            </a>
          </div>
          {op.summary ? (
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">{op.summary}</p>
          ) : null}
          {op.description ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-200">{op.description}</p>
          ) : null}
        </div>
      </div>

      {/* Parameter inputs and live URL preview */}
      <OperationDetail op={op} />
    </article>
  );
}
