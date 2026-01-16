export function generatePython({ url, method, body, authToken }: { url: string; method: string; body?: string; authToken?: string }) {
  const m = method.toUpperCase();
  const hdrLines = (() => {
    const headers: Record<string, string> = {};
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    if (body) headers["Content-Type"] = "application/json";
    if (Object.keys(headers).length === 0) return "";
    return `headers = ${JSON.stringify(headers)}\n`;
  })();
  const dataLine = body ? `data = ${body}\n` : "";
  const headersArg = hdrLines ? "headers=headers" : "";
  const jsonArg = body ? `${headersArg ? ", " : ""}json=data` : "";
  const args = [headersArg, jsonArg].filter(Boolean).join("");
  return (
    "import requests\n" +
    hdrLines +
    dataLine +
    `response = requests.request('${m}', '${url}'${args ? `, ${args}` : ""})\n` +
    "print(response.status_code)\nprint(response.text)"
  );
}
