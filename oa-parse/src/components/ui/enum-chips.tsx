import { memo } from "react";

export const EnumChips = memo(function EnumChips({ values }: { values: (string | number)[] }) {
  if (!values?.length) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
      {values.map((v, i) => (
        <span key={i} className="rounded bg-slate-100 px-2 py-[1px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {String(v)}
        </span>
      ))}
    </div>
  );
});

