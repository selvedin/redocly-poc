import { useMemo, useState } from "react";
import type { ResponseInfo } from "@/lib/openapi/load";
import { StatusTabs } from "@/components/response-view/status-tabs";
import { ResponsePanel } from "@/components/response-view/response-panel";

export default function ResponseView({ responses, expandAll = false }: { responses: ResponseInfo[]; expandAll?: boolean }) {
  const [activeStatus, setActiveStatus] = useState(responses[0]?.status);
  const active = useMemo(() => responses.find((r) => r.status === activeStatus) ?? responses[0], [responses, activeStatus]);

  if (!responses.length) return null;
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Responses</p>
        <StatusTabs responses={responses} activeStatus={active?.status} onSelect={setActiveStatus} />
      </div>

      <ResponsePanel response={active} expandAll={expandAll} />
    </div>
  );
}
