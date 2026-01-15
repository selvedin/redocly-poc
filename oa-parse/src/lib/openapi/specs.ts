import fs from "node:fs/promises";
import path from "node:path";
import { loadOpenApiSpec, type OpenAPIDocument } from "@/lib/openapi/load";

export type SpecItem = {
  key: string; // filename without extension
  fileName: string; // e.g., payments.yaml
  title: string;
  spec: OpenAPIDocument;
};

const SPECS_DIR = path.join(process.cwd(), "public", "specs");

export async function listSpecs(): Promise<SpecItem[]> {
  const entries = await fs.readdir(SPECS_DIR);
  const yamlFiles = entries.filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));
  const items: SpecItem[] = [];
  for (const file of yamlFiles) {
    const key = file.replace(/\.(yaml|yml)$/i, "");
    const specPath = path.join("public", "specs", file);
    // Reuse loader by temporarily adjusting SPEC_PATH? We'll load file content directly here.
    const fileAbs = path.join(SPECS_DIR, file);
    const content = await fs.readFile(fileAbs, "utf8");
    const { default: yaml } = await import("js-yaml");
    const parsed = yaml.load(content) as OpenAPIDocument;
    const info = (parsed.info as any) ?? {};
    items.push({ key, fileName: file, title: info.title ?? key, spec: parsed });
  }
  return items;
}

