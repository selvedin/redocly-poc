import { memo } from "react";

export type ResponseExampleProps = {
  example?: string;
};

function ResponseExampleBase({ example }: ResponseExampleProps) {
  if (!example) return null;
  return (
    <pre className="mt-2 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100">
      {example}
    </pre>
  );
}

export const ResponseExample = memo(ResponseExampleBase);

