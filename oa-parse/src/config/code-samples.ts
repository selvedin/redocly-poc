import type { Language } from "@/lib/codegen/templates";

export type LanguageOption = {
  key: Language;
  label: string;
  highlight: string;
  loader: () => Promise<any>;
};

export const languageOptions: LanguageOption[] = [
  { key: "curl", label: "curl", highlight: "bash", loader: () => import("highlight.js/lib/languages/bash") },
  { key: "js", label: "JavaScript", highlight: "javascript", loader: () => import("highlight.js/lib/languages/javascript") },
  { key: "python", label: "Python", highlight: "python", loader: () => import("highlight.js/lib/languages/python") },
  { key: "java", label: "Java", highlight: "java", loader: () => import("highlight.js/lib/languages/java") },
  { key: "csharp", label: "C#", highlight: "csharp", loader: () => import("highlight.js/lib/languages/csharp") },
];

export const highlightMap: Record<Language, string> = Object.fromEntries(
  languageOptions.map((o) => [o.key, o.highlight])
) as Record<Language, string>;

