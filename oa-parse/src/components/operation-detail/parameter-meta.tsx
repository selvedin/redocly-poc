import { memo } from "react";
import type { Parameter } from "@/lib/openapi/load";

export type ParameterMetaProps = {
  param: Parameter;
  typeLabel: string;
  rangeText?: string;
};

function ParameterMetaBase({ param, typeLabel, rangeText }: ParameterMetaProps) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {param.name}
        <span className="ml-2 rounded bg-slate-100 px-1 py-[1px] text-[10px] uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {param.in}
        </span>
        <span className="ml-2 text-[10px] uppercase text-slate-400">{typeLabel}</span>
        {param.required ? <span className="ml-2 text-rose-600">*</span> : null}
      </span>
      {param.description ? (
        <p className="line-clamp-2 text-[11px] text-slate-500 dark:text-slate-400">{param.description}</p>
      ) : null}
      {rangeText ? <p className="text-[11px] text-slate-500 dark:text-slate-400">Range: {rangeText}</p> : null}
    </div>
  );
}

export const ParameterMeta = memo(ParameterMetaBase);

