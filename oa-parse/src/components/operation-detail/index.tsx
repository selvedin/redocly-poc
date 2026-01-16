"use client";

import { useState, useEffect } from "react";
import type { Operation } from "@/lib/openapi/load";
import ResponseView from "@/components/response-view";
import TryItModal from "@/components/try-it-modal";
import { ParameterInput } from "@/components/operation-detail/parameter-input";
import { AuthPanel } from "@/components/operation-detail/auth-panel";
import { HeaderActions } from "@/components/operation-detail/header-actions";
import { useAuthToken } from "@/hooks/use-auth-token";
import { useOperationUrl } from "@/hooks/use-operation-url";
import { TagsList } from "@/components/operation-detail/tags-list";
import { RequestBodyCard } from "@/components/operation-detail/request-body-card";
import { RequestSamplesCard } from "@/components/operation-detail/request-samples-card";

export default function OperationDetail({ op }: { op: Operation }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [expandAll, setExpandAll] = useState(false);
  const [showTryIt, setShowTryIt] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { authToken, setAuthToken, generateDemoToken } = useAuthToken();
  const url = useOperationUrl(op.path, values, op.parameters);

  useEffect(() => {
    // Default expand on first render for better visibility of request body fields.
    setExpandAll(true);
  }, []);

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <TagsList tags={op.tags} />
        <HeaderActions onToggleAuth={() => setShowAuth((v) => !v)} onTryIt={() => setShowTryIt(true)} />
      </div>

      {showAuth ? (
        <AuthPanel authToken={authToken} onChange={setAuthToken} onGenerate={() => setAuthToken(generateDemoToken())} />
      ) : null}

      {op.parameters.length ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {op.parameters.map((p) => {
            const value = values[p.name] ?? "";

            return (
              <ParameterInput key={p.name} param={p} value={value} onChange={(next) => setValues((prev) => ({ ...prev, [p.name]: next }))} />
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">No parameters.</p>
      )}

      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-3 min-w-0">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100">
            {url}
          </div>
          <RequestBodyCard
            url={url}
            contentTypes={op.requestBodyContentTypes}
            required={op.requestBodyRequired}
            schema={op.requestBodySchema}
            example={op.requestBodyExample}
            expandAll={expandAll}
            onExpandAll={() => setExpandAll(true)}
            onCollapseAll={() => setExpandAll(false)}
          />
        </div>

        <div className="space-y-3 min-w-0">
          <RequestSamplesCard url={url} method={op.method} body={op.requestBodySample} authToken={authToken} />
          {op.responses?.length ? (
            <div className="rounded-lg border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
              <ResponseView responses={op.responses} expandAll={expandAll} />
            </div>
          ) : null}
        </div>
      </div>

      <TryItModal open={showTryIt} onClose={() => setShowTryIt(false)} operation={op} url={url} authToken={authToken} />
    </div>
  );
}
