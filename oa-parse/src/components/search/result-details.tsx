import { memo } from "react";
import type { SearchDoc } from "@/lib/search";

export type ResultDetailsProps = {
  item: SearchDoc;
};

function ResultDetailsBase({ item }: ResultDetailsProps) {
  return (
    <div className="flex-1">
      <p className="font-mono text-xs text-slate-800 dark:text-slate-200">{item.path}</p>
      {item.summary ? <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{item.summary}</p> : null}
      {item.description ? <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{item.description}</p> : null}
    </div>
  );
}

export const ResultDetails = memo(ResultDetailsBase);

