import { memo } from "react";
import type { Operation } from "@/lib/openapi/load";
import OperationDetail from "@/components/operation-detail";
import OperationHeader from "@/components/operation-card/header";

function OperationCardBase({ op }: { op: Operation }) {
  return (
    <article
      id={op.id}
      className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm backdrop-blur transition hover:border-[color:var(--border-strong)] dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
    >
      <OperationHeader op={op} />
      <OperationDetail op={op} />
    </article>
  );
}

export const OperationCard = memo(OperationCardBase);

export default OperationCard;
