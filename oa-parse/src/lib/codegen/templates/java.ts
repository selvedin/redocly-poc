export function generateJava({ url, method, body, authToken }: { url: string; method: string; body?: string; authToken?: string }) {
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
  const lines = hasParsed
    ? JSON.stringify(parsed, null, 2)
        .split("\n")
        .map((l) => ` "${l.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",`)
    : body
    ? [" \"" + String(body).replace(/"/g, '\\"') + "\""]
    : [];
  const payloadBlock = lines.length
    ? [
        "    var payload = String.join(\"\\n\"",
        ...lines.map((l) => `      , ${l}`),
        "    );",
      ].join("\n")
    : "    var payload = \"\";";
  const host = url.startsWith("http") ? url.replace(/(https?:\/\/[^\/]+)(.*)/, "$1") : "";
  const path = url.startsWith("http") ? url.replace(/https?:\/\/[^\/]+/, "") : url;
  const authHeader = authToken ? `.header(\"Authorization\", \"Bearer ${authToken}\")` : "";
  const contentHeader = body ? `.header(\"Content-Type\", \"application/json\")` : "";
  return [
    "import java.net.*;",
    "import java.net.http.*;",
    "import java.util.*;",
    "",
    "public class App {",
    "  public static void main(String[] args) throws Exception {",
    "    var httpClient = HttpClient.newBuilder().build();",
    payloadBlock,
    `    var host = \"${host || "http://127.0.0.1:5005"}\";`,
    `    var pathname = \"${path}\";`,
    "    var request = HttpRequest.newBuilder()",
    body ? `      .method(\"${m}\", HttpRequest.BodyPublishers.ofString(payload))` : `      .method(\"${m}\", HttpRequest.BodyPublishers.noBody())`,
    authHeader,
    contentHeader,
    "      .uri(URI.create(host + pathname))",
    "      .build();",
    "",
    "    var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());",
    "    System.out.println(response.statusCode());",
    "    System.out.println(response.body());",
    "  }",
    "}",
  ].join("\n");
}
