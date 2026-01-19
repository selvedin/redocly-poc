import SchemaTree from "@/components/schema-tree";
import { memo } from "react";
import { RequestBodyHeader } from "@/components/operation-detail/request-body-header";
import { RequestBodyExample } from "@/components/operation-detail/request-body-example";

export type RequestBodyCardProps = {
  url: string;
  contentTypes?: string[];
  required?: boolean;
  schema?: any;
  example?: string;
  expandAll: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
};

function RequestBodyCardBase({ url, contentTypes, required, schema, example, expandAll, onExpandAll, onCollapseAll }: RequestBodyCardProps) {
  if (!schema) return null;
  const firstContentType = contentTypes && contentTypes[0];

  return (
    <div className="space-y-3 min-w-0">
      <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3 font-mono text-xs text-[color:var(--foreground)] shadow-sm dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100">
        {url}
      </div>
      <div className="space-y-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <RequestBodyHeader
          contentType={firstContentType}
          required={required}
          onExpandAll={onExpandAll}
          onCollapseAll={onCollapseAll}
        />
        <SchemaTree schema={schema} expandAll={expandAll} />
        <RequestBodyExample example={example} />
      </div>
    </div>
  );
}

export const RequestBodyCard = memo(RequestBodyCardBase);

