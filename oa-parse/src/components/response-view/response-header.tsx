import { memo } from "react";

export type ResponseHeaderProps = {
  status: string;
  contentType?: string;
  description?: string;
};

function ResponseHeaderBase({ status, contentType, description }: ResponseHeaderProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-semibold text-[color:var(--foreground)] dark:text-slate-100">{status}</span>
      <div className="flex items-center gap-2">
        {contentType ? (
          <span className="rounded bg-[color:var(--muted)] px-2 py-[2px] text-[11px] text-[color:var(--foreground)] shadow-sm dark:bg-slate-800 dark:text-slate-200">
            {contentType}
          </span>
        ) : null}
        {description ? <span className="text-xs text-[color:var(--muted-foreground)] dark:text-slate-400">{description}</span> : null}
      </div>
    </div>
  );
}

export const ResponseHeader = memo(ResponseHeaderBase);

