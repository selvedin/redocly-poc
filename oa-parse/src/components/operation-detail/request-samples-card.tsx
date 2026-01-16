import { memo } from "react";
import CodeSamples from "@/components/code-samples";

export type RequestSamplesCardProps = {
  url: string;
  method: string;
  body?: string;
  authToken?: string;
};

function RequestSamplesCardBase({ url, method, body, authToken }: RequestSamplesCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/60 lg:overflow-x-auto">
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Request samples</p>
      <div className="mt-2">
        <CodeSamples url={url} method={method} body={body} authToken={authToken} />
      </div>
    </div>
  );
}

export const RequestSamplesCard = memo(RequestSamplesCardBase);

