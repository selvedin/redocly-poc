export function generateCurl({ url, method, body, authToken }: { url: string; method: string; body?: string; authToken?: string }) {
  const m = method.toUpperCase();
  const headers = [] as string[];
  if (authToken) headers.push(`-H 'Authorization: Bearer ${authToken}'`);
  if (body) headers.push("-H 'Content-Type: application/json'");
  const data = body ? `--data '${body}'` : "";
  const hdrs = headers.join(" ");
  return `curl -X ${m} ${hdrs} ${data} '${url}'`.trim();
}
