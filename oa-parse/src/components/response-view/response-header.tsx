import { memo } from "react";

export type ResponseHeaderProps = {
  status: string;
  contentType?: string;
  description?: string;
};

function ResponseHeaderBase({ status, contentType, description }: ResponseHeaderProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-semibold text-slate-800 dark:text-slate-100">{status}</span>
      <div className="flex items-center gap-2">
        {contentType ? (
          <span className="rounded bg-slate-100 px-2 py-[2px] text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {contentType}
          </span>
        ) : null}
        {description ? <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span> : null}
      </div>
    </div>
  );
}

export const ResponseHeader = memo(ResponseHeaderBase);

