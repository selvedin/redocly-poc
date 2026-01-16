import { memo } from "react";
import type { Parameter } from "@/lib/openapi/load";
import { validateValue } from "@/lib/validation/parameters";
import { ParameterMeta } from "@/components/operation-detail/parameter-meta";

export type ParamInputProps = {
  param: Parameter;
  value: string;
  onChange: (value: string) => void;
};

function ParameterInputBase({ param, value, onChange }: ParamInputProps) {
  const schema = param.schema ?? {};
  const typeLabel = schema.type ?? "any";
  const range = [schema.minimum, schema.maximum].filter((v) => v !== undefined).join(" – ");
  const error = validateValue(value, param);

  return (
    <label
      className="flex h-full flex-col justify-between gap-2 rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-900/60"
      style={{ minHeight: 140 }}
    >
      <ParameterMeta param={param} typeLabel={typeLabel} rangeText={range || undefined} />

      <input
        className={`rounded-md border bg-white px-2 py-1 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 ${error ? "border-rose-400 focus-border-rose-500 dark:border-rose-500" : "border-slate-300"}`}
        placeholder={param.example !== undefined ? String(param.example) : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <p className="text-[11px] text-rose-500">{error}</p> : null}
    </label>
  );
}

export const ParameterInput = memo(ParameterInputBase);

