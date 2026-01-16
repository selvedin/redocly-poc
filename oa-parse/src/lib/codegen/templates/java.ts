export function generateJava({ url, method, body }: { url: string; method: string; body?: string }) {
  const m = method.toUpperCase();
  const hasBody = Boolean(body);
  return (
    "import java.net.http.HttpClient;\n" +
    "import java.net.http.HttpRequest;\n" +
    "import java.net.http.HttpResponse;\n" +
    "import java.net.URI;\n\n" +
    "public class Example {\n" +
    "  public static void main(String[] args) throws Exception {\n" +
    "    HttpClient client = HttpClient.newHttpClient();\n" +
    `    HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create("${url}"));\n` +
    (hasBody
      ? `    builder.method("${m}", HttpRequest.BodyPublishers.ofString(${JSON.stringify(body)}));\n    builder.header("Content-Type", "application/json");\n`
      : `    builder.method("${m}", HttpRequest.BodyPublishers.noBody());\n`) +
    "    HttpRequest request = builder.build();\n" +
    "    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\n" +
    "    System.out.println(response.statusCode());\n" +
    "    System.out.println(response.body());\n" +
    "  }\n" +
    "}"
  );
}

