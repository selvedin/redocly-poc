export function generateJs({ url, method, body, authToken }: { url: string; method: string; body?: string; authToken?: string }) {
  const m = method.toUpperCase();
  const headers: Record<string, string> = {};
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  if (body) headers["Content-Type"] = "application/json";
  const options: Record<string, unknown> = { method: m };
  if (Object.keys(headers).length) options.headers = headers;
  if (body) options.body = body;
  const optionsStr = JSON.stringify(options, null, 2);
  return `fetch('${url}', ${optionsStr})\n  .then(r => r.json())\n  .then(console.log)\n  .catch(console.error)`;
}
