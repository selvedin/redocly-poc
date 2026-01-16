export function generatePython({ url, method, body, authToken }: { url: string; method: string; body?: string; authToken?: string }) {
  const m = method.toUpperCase();
  let parsed: unknown;
  if (body) {
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = undefined;
    }
  }
  const hasParsed = parsed && typeof parsed === "object";
  const headers: Record<string, string> = {};
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  if (body) headers["Content-Type"] = "application/json";
  const headersLine = Object.keys(headers).length ? `headers = ${JSON.stringify(headers, null, 2)}\n` : "";
  const dataLine = hasParsed ? `data = ${JSON.stringify(parsed, null, 2)}\n` : body ? `data = ${JSON.stringify(body)}\n` : "";
  const args: string[] = [];
  if (headersLine) args.push("headers=headers");
  if (body) args.push("json=data");
  const argStr = args.length ? `, ${args.join(", ")}` : "";
  return (
    "import requests\n" +
    headersLine +
    dataLine +
    `response = requests.request('${m}', '${url}'${argStr})\n` +
    "print(response.status_code)\nprint(response.text)"
  );
}
