export function generateCurl({ url, method, body }: { url: string; method: string; body?: string }) {
  const m = method.toUpperCase();
  const headers = body ? ["-H 'Content-Type: application/json'"] : [];
  const data = body ? `--data '${body}'` : "";
  const hdrs = headers.join(" ");
  return `curl -X ${m} ${hdrs} ${data} '${url}'`.trim();
}
