export function generateCs({ url, method, body, authToken }: { url: string; method: string; body?: string; authToken?: string }) {
  const m = method.toUpperCase();
  let parsed: any;
  if (body) {
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = undefined;
    }
  }
  const hasParsedObject = parsed && typeof parsed === "object";
  const payload = hasParsedObject ? parsed : body ? body : {};
  const authHeader = authToken ? `        {"Authorization", "Bearer ${authToken}"},` : "";

  function toCSharpAnon(value: any, indent = 6): string {
    const pad = " ".repeat(indent);
    if (Array.isArray(value)) {
      const items = value.map((v) => toCSharpAnon(v, indent + 2));
      return `new[] { ${items.join(", ")} }`;
    }
    if (value && typeof value === "object") {
      const entries = Object.entries(value).map(([k, v]) => {
        const key = /[^a-zA-Z0-9_]/.test(k) ? `@"${k}"` : k;
        return `${pad}  ${key} = ${toCSharpAnon(v, indent + 2)}`;
      });
      return entries.length
        ? `new\n${pad}{\n${entries.join(",\n")}\n${pad}}`
        : "new { }";
    }
    if (typeof value === "string") return `\"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}\"`;
    if (value === null) return "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    return String(value);
  }

  const jsonLine = hasParsedObject
    ? `    string json = JsonSerializer.Serialize(${toCSharpAnon(payload)});`
    : `    string json = ${JSON.stringify(payload)};`;

  return [
    "using System;",
    "using System.Net.Http;",
    "using System.Threading.Tasks;",
    "using System.Text;",
    "using System.Text.Json;",
    "",
    "public class Program {",
    "  public static async Task Main()",
    "  {",
    "    System.Net.Http.HttpClient client = new()",
    "    {",
    "      DefaultRequestHeaders =",
    "      {",
    authHeader ? `        ${authHeader}` : undefined,
    "        {\"X-API-Key\", \"YOUR_API_KEY_HERE\"},",
    "      }",
    "    };",
    "",
    jsonLine,
    "",
    "    using StringContent postData = new(json, Encoding.UTF8, \"application/json\");",
    `    using HttpResponseMessage request = await client.${m === "GET" ? "GetAsync" : "PostAsync"}("${url}", ${m === "GET" ? "null" : "postData"});`,
    "    string response = await request.Content.ReadAsStringAsync();",
    "",
    "    Console.WriteLine(response);",
    "  }",
    "}",
  ]
    .filter(Boolean)
    .join("\n");
}
