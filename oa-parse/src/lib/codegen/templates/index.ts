import { generateCurl } from "./curl";
import { generateJs } from "./js";
import { generatePython } from "./python";
import { generateJava } from "./java";
import { generateCs } from "./cs";

export type Language = "curl" | "js" | "python" | "java" | "csharp";

export function generateSample(lang: Language, { url, method, body, authToken }: { url: string; method: string; body?: string; authToken?: string }) {
  switch (lang) {
    case "curl":
      return generateCurl({ url, method, body, authToken });
    case "js":
      return generateJs({ url, method, body, authToken });
    case "python":
      return generatePython({ url, method, body, authToken });
    case "java":
      return generateJava({ url, method, body, authToken });
    case "csharp":
      return generateCs({ url, method, body, authToken });
    default:
      return "";
  }
}
