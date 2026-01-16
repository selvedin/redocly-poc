import { generateCurl } from "./curl";
import { generateJs } from "./js";
import { generatePython } from "./python";
import { generateJava } from "./java";
import { generateCs } from "./cs";

export type Language = "curl" | "js" | "python" | "java" | "csharp";

export function generateSample(lang: Language, { url, method, body }: { url: string; method: string; body?: string }) {
  switch (lang) {
    case "curl":
      return generateCurl({ url, method, body });
    case "js":
      return generateJs({ url, method, body });
    case "python":
      return generatePython({ url, method, body });
    case "java":
      return generateJava({ url, method, body });
    case "csharp":
      return generateCs({ url, method, body });
    default:
      return "";
  }
}

