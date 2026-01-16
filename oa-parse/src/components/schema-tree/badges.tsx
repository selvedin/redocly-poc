import { memo } from "react";

export const TypeBadge = memo(function TypeBadge({ type }: { type?: string }) {
  if (!type) return null;
  return (
    <span className="ml-2 rounded bg-slate-100 px-1 py-[1px] text-[10px] uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {type}
    </span>
  );
});

export const ConstraintBadge = memo(function ConstraintBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="ml-2 rounded bg-slate-100 px-1 py-[1px] text-[10px] uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {label}: {value}
    </span>
  );
});

