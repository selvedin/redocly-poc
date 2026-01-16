export function generateCs({ url, method, body, authToken }: { url: string; method: string; body?: string; authToken?: string }) {
  const m = method.toUpperCase();
  const hasBody = Boolean(body);
  const authLine = authToken ? `    request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "${authToken}");\n` : "";
  return (
    "using System;\n" +
    "using System.Net.Http;\n" +
    "using System.Text;\n" +
    "using System.Threading.Tasks;\n\n" +
    "class Program {\n" +
    "  static async Task Main() {\n" +
    "    using var client = new HttpClient();\n" +
    (hasBody
      ? `    var content = new StringContent(${JSON.stringify(body)}, Encoding.UTF8, "application/json");\n`
      : "") +
    `    var request = new HttpRequestMessage(new HttpMethod("${m}"), "${url}");\n` +
    (hasBody ? "    request.Content = content;\n" : "") +
    authLine +
    "    var response = await client.SendAsync(request);\n" +
    "    Console.WriteLine((int)response.StatusCode);\n" +
    "    Console.WriteLine(await response.Content.ReadAsStringAsync());\n" +
    "  }\n" +
    "}"
  );
}
