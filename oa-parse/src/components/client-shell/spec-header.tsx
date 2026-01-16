import type { SpecMeta } from "./types";

export default function SpecHeader({ meta }: { meta?: SpecMeta }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Version: {meta?.version ?? "n/a"}
      </p>
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{meta?.title ?? "OpenAPI Spec"}</h1>
      {meta?.description ? (
        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{meta.description}</p>
      ) : null}
    </div>
  );
}

