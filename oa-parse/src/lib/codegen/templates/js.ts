export function generateJs({ url, method, body }: { url: string; method: string; body?: string }) {
  const m = method.toUpperCase();
  const headers = body ? { "Content-Type": "application/json" } : undefined;
  const options: Record<string, unknown> = { method: m };
  if (headers) options.headers = headers;
  if (body) options.body = body;
  const optionsStr = JSON.stringify(options, null, 2);
  return `fetch('${url}', ${optionsStr})\n  .then(r => r.json())\n  .then(console.log)\n  .catch(console.error)`;
}

