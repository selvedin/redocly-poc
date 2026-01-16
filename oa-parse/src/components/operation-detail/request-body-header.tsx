import { memo } from "react";
import Button from "@/components/ui/button";

export type RequestBodyHeaderProps = {
  contentType?: string;
  required?: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
};

function RequestBodyHeaderBase({ contentType, required, onExpandAll, onCollapseAll }: RequestBodyHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
      <div className="flex items-center gap-2">
        <span>Request body</span>
        {contentType ? (
          <span className="rounded bg-slate-100 px-2 py-[2px] text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {contentType}
          </span>
        ) : null}
        {required ? (
          <span className="rounded bg-rose-100 px-2 py-[2px] text-[11px] text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">required</span>
        ) : null}
      </div>
      <div className="flex gap-2 text-xs">
        <Button variant="outline" size="xs" onClick={onExpandAll} label="Expand all" />
        <Button variant="outline" size="xs" onClick={onCollapseAll} label="Collapse all" />
      </div>
    </div>
  );
}

export const RequestBodyHeader = memo(RequestBodyHeaderBase);

