export function generatePython({ url, method, body }: { url: string; method: string; body?: string }) {
  const m = method.toUpperCase();
  const hdrLines = body ? "headers = {'Content-Type': 'application/json'}\n" : "";
  const dataLine = body ? `data = ${body}\n` : "";
  return (
    "import requests\n" +
    hdrLines +
    dataLine +
    `response = requests.request('${m}', '${url}'${body ? ", headers=headers, json=data" : ""})\n` +
    "print(response.status_code)\nprint(response.text)"
  );
}

