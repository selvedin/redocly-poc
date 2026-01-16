export function generateJs({ url, method, body, authToken }: { url: string; method: string; body?: string; authToken?: string }) {
  const m = method.toUpperCase();
  const headers: Record<string, string> = {};
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  let parsed: unknown;
  if (body) {
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = undefined;
    }
  }
  const hasParsed = parsed && typeof parsed === "object";
  if (body) headers["Content-Type"] = "application/json";
  const headersStr = Object.keys(headers).length ? JSON.stringify(headers, null, 2) : undefined;

  const payloadDecl = hasParsed ? `const payload = ${JSON.stringify(parsed, null, 2)};` : body ? `const payload = ${JSON.stringify(body)};` : "";
  const bodyLine = body ? "    body: JSON.stringify(payload),\n" : "";
  const headersLine = headersStr ? `    headers: ${headersStr.replace(/\n/g, "\n    ")},\n` : "";

  return [
    payloadDecl,
    "const resp = await fetch(\"" + url + "\", {",
    `  method: '${m}',`,
    headersLine.trimEnd(),
    bodyLine.trimEnd(),
    "});",
    "",
    "const data = await resp.json();",
    "console.log(data);",
  ]
    .filter(Boolean)
    .join("\n");
}
