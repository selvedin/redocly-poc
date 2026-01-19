import { memo } from "react";

export type RequestBodyExampleProps = {
  example?: string;
};

function RequestBodyExampleBase({ example }: RequestBodyExampleProps) {
  if (!example) return null;
  return (
    <div>
      <p className="mt-2 text-xs font-medium text-[color:var(--muted-foreground)] dark:text-slate-300">Example</p>
      <pre className="mt-1 overflow-auto rounded-md border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3 text-xs text-[color:var(--foreground)] shadow-sm dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100">
        {example}
      </pre>
    </div>
  );
}

export const RequestBodyExample = memo(RequestBodyExampleBase);

