import { memo } from "react";
import type { Operation } from "@/lib/openapi/load";
import MethodPill from "@/components/operation-card/method-pill";

function OperationHeaderBase({ op }: { op: Operation }) {
  return (
    <div className="flex items-start gap-3">
      <MethodPill method={op.method} />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-sm text-slate-800 dark:text-slate-100">{op.path}</p>
          <a href={`#${op.id}`} className="text-xs text-slate-500 underline-offset-4 hover:underline">
            #
          </a>
        </div>
        {op.summary ? (
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">{op.summary}</p>
        ) : null}
        {op.description ? (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-200">{op.description}</p>
        ) : null}
      </div>
    </div>
  );
}

const OperationHeader = memo(OperationHeaderBase);

export default OperationHeader;
