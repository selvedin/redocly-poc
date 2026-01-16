import { memo } from "react";
import SchemaTree from "@/components/schema-tree";
import type { ResponseInfo } from "@/lib/openapi/load";
import { ResponseHeader } from "@/components/response-view/response-header";
import { ResponseExample } from "@/components/response-view/response-example";

export type ResponsePanelProps = {
  response?: ResponseInfo;
  expandAll?: boolean;
};

function ResponsePanelBase({ response, expandAll }: ResponsePanelProps) {
  if (!response) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
      <ResponseHeader status={response.status} contentType={response.contentType} description={response.description} />
      {response.schema ? (
        <div className="mt-2">
          <SchemaTree schema={response.schema} expandAll={expandAll} />
        </div>
      ) : null}
      <ResponseExample example={response.example} />
    </div>
  );
}

export const ResponsePanel = memo(ResponsePanelBase);

