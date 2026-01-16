"use client";

import { useMemo, useState } from "react";
import type { Operation, Parameter } from "@/lib/openapi/load";
import CodeSamples from "@/components/code-samples";
import SchemaTree from "@/components/schema-tree";
import ResponseView from "@/components/response-view";

function buildUrl(basePath: string, params: Record<string, string>, parameters: Parameter[]) {
  // Replace path params
  let url = basePath;
  parameters
    .filter((p) => p.in === "path")
    .forEach((p) => {
      const val = params[p.name] ?? String(p.example ?? "");
      url = url.replace(new RegExp(`{${p.name}}`, "g"), encodeURIComponent(val));
    });

  // Append query params
  const queryParts = parameters
    .filter((p) => p.in === "query")
    .map((p) => {
      const val = params[p.name];
      if (val && val.length > 0) {
        return `${encodeURIComponent(p.name)}=${encodeURIComponent(val)}`;
      }
      return null;
    })
    .filter(Boolean) as string[];

  if (queryParts.length > 0) {
    url += (url.includes("?") ? "&" : "?") + queryParts.join("&");
  }
  return url;
}

export default function OperationDetail({ op }: { op: Operation }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [expandAll, setExpandAll] = useState(false);

  const url = useMemo(() => buildUrl(op.path, values, op.parameters), [op.path, values, op.parameters]);

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2 text-xs">
          {op.tags?.length ? op.tags.map((t) => (
            <span key={t} className="rounded bg-slate-100 px-2 py-[2px] text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">{t}</span>
          )) : null}
        </div>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setExpandAll(true)}
            className="rounded border border-slate-300 px-2 py-1 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={() => setExpandAll(false)}
            className="rounded border border-slate-300 px-2 py-1 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Collapse all
          </button>
        </div>
      </div>

      {op.parameters.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {op.parameters.map((p) => (
            <label key={p.name} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {p.name}
                <span className="ml-2 rounded bg-slate-100 px-1 py-[1px] text-[10px] uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {p.in}
                </span>
                {p.required ? <span className="ml-2 text-rose-600">*</span> : null}
              </span>
              <input
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500"
                placeholder={p.example !== undefined ? String(p.example) : undefined}
                value={values[p.name] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [p.name]: e.target.value }))}
              />
            </label>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">No parameters.</p>
      )}

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100">
        {url}
      </div>

      {op.requestBodySchema ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            <span>Request body</span>
            {op.requestBodyContentTypes?.[0] ? (
              <span className="rounded bg-slate-100 px-2 py-[2px] text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {op.requestBodyContentTypes[0]}
              </span>
            ) : null}
            {op.requestBodyRequired ? (
              <span className="rounded bg-rose-100 px-2 py-[2px] text-[11px] text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">required</span>
            ) : null}
          </div>
          <SchemaTree schema={op.requestBodySchema} expandAll={expandAll} />
          {op.requestBodyExample ? (
            <div>
              <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">Example</p>
              <pre className="mt-1 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100">
                {op.requestBodyExample}
              </pre>
            </div>
          ) : null}
        </div>
      ) : null}

      <CodeSamples url={url} method={op.method} body={op.requestBodySample} />

      <ResponseView responses={op.responses} expandAll={expandAll} />
    </div>
  );
}
