"use client";

import { useEffect, useMemo, useState } from "react";
import type { Operation } from "@/lib/openapi/load";

export default function TryItModal({
  open,
  onClose,
  operation,
  url: initialUrl,
  authToken,
}: {
  open: boolean;
  onClose: () => void;
  operation: Operation;
  url: string;
  authToken?: string;
}) {
  const [server, setServer] = useState<string>(operation.servers?.[0] ?? "");
  const [body, setBody] = useState<string>(operation.requestBodySample ?? "");
  const [loading, setLoading] = useState(false);
  const [customHeaders, setCustomHeaders] = useState<string>("Content-Type: application/json\n");
  const [result, setResult] = useState<{ status?: number; headers?: Record<string, string>; body?: string; error?: string }>({});

  function upsertAuthHeader(text: string, token?: string) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const filtered = lines.filter((l) => !l.toLowerCase().startsWith("authorization:"));
    if (token) filtered.push(`Authorization: Bearer ${token}`);
    return filtered.join("\n") + "\n";
  }

  useEffect(() => {
    if (open) {
      setServer(operation.servers?.[0] ?? "");
      setBody(operation.requestBodySample ?? "");
      setCustomHeaders((prev) => upsertAuthHeader(prev.trim().length ? prev : "Content-Type: application/json\n", authToken));
      setResult({});
    }
  }, [open, operation, authToken]);

  useEffect(() => {
    if (!open) return;
    setCustomHeaders((prev) => upsertAuthHeader(prev, authToken));
  }, [authToken, open]);

  const url = useMemo(() => {
    if (server) {
      if (initialUrl.startsWith("http")) return initialUrl;
      return `${server}${initialUrl}`;
    }
    return initialUrl;
  }, [server, initialUrl]);

  function parseHeaders(text: string): Record<string, string> {
    const out: Record<string, string> = {};
    text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((line) => {
        const idx = line.indexOf(":");
        if (idx > 0) {
          const k = line.slice(0, idx).trim();
          const v = line.slice(idx + 1).trim();
          if (k) out[k] = v;
        }
      });
    return out;
  }

  async function sendRequest() {
    setLoading(true);
    setResult({});
    try {
      const headers = parseHeaders(customHeaders);
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
      const res = await fetch(url, {
        method: operation.method.toUpperCase(),
        headers,
        body: body && body.trim().length ? body : undefined,
      });
      const text = await res.text();
      const respHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        respHeaders[k] = v;
      });
      setResult({ status: res.status, headers: respHeaders, body: text });
    } catch (e: any) {
      setResult({ error: e?.message ?? "Request failed" });
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-8">
      <div className="w-full max-w-5xl rounded-lg bg-[color:var(--card)] p-4 shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Try it</h2>
          <button onClick={onClose} className="rounded border border-[color:var(--border)] px-2 py-1 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--muted)] dark:border-slate-700 dark:text-slate-100">Close</button>
        </div>

        <div className="mt-3 space-y-3 text-sm">
          {operation.servers?.length ? (
            <label className="flex flex-col gap-1 text-xs text-[color:var(--foreground)] dark:text-slate-200">
              Server
              <select
                className="rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-1 text-sm text-[color:var(--foreground)] shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                value={server}
                onChange={(e) => setServer(e.target.value)}
              >
                {operation.servers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <div className="space-y-1">
            <div className="text-xs font-medium text-[color:var(--muted-foreground)] dark:text-slate-300">Request URL</div>
            <div className="rounded border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-2 py-1 font-mono text-xs text-[color:var(--foreground)] shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              {url}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-medium text-[color:var(--muted-foreground)] dark:text-slate-300">Headers</div>
            {authToken ? (
              <p className="text-[11px] text-green-600 dark:text-green-300">Authorization: Bearer token applied</p>
            ) : null}
            <textarea
              className="h-24 w-full rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-1 font-mono text-xs text-[color:var(--foreground)] shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              value={customHeaders}
              onChange={(e) => setCustomHeaders(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-medium text-[color:var(--muted-foreground)] dark:text-slate-300">Request body</div>
            <textarea
              className="h-40 w-full rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-1 font-mono text-xs text-[color:var(--foreground)] shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={sendRequest}
              disabled={loading}
              className="rounded bg-[color:var(--foreground)] px-3 py-1 text-sm text-white shadow hover:brightness-95 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {loading ? "Sending…" : "Send"}
            </button>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{operation.method.toUpperCase()}</span>
          </div>

          <div className="space-y-2 rounded border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3 text-xs text-[color:var(--foreground)] shadow-sm dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100">
            <div className="font-semibold">Response</div>
            {result.error ? <div className="text-rose-600">{result.error}</div> : null}
            {result.status !== undefined ? <div>Status: {result.status}</div> : null}
            {result.headers ? (
              <details open>
                <summary className="cursor-pointer">Headers</summary>
                <pre className="overflow-auto">
                  {JSON.stringify(result.headers, null, 2)}
                </pre>
              </details>
            ) : null}
            {result.body ? (
              <details open>
                <summary className="cursor-pointer">Body</summary>
                <pre className="overflow-auto">
                  {result.body}
                </pre>
              </details>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
