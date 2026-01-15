import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

export type OpenAPIDocument = Record<string, unknown>;

const SPEC_PATH = path.join(process.cwd(), "public", "specs", "openapi.yaml");

export async function loadOpenApiSpec(): Promise<OpenAPIDocument> {
  const file = await fs.readFile(SPEC_PATH, "utf8");
  const parsed = yaml.load(file);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Failed to parse OpenAPI spec");
  }
  return parsed as OpenAPIDocument;
}

export type Parameter = {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required?: boolean;
  example?: unknown;
};

export type Operation = {
  id: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  parameters: Parameter[];
};

export function getOperations(spec: OpenAPIDocument, opts?: { specKey?: string }): Operation[] {
  const paths = (spec.paths as Record<string, any>) ?? {};
  const operations: Operation[] = [];
  const servers = (spec.servers as any[]) ?? [];
  const baseUrl: string | undefined = servers[0]?.url;
  const specPrefix = opts?.specKey ? `${opts.specKey}-` : "";

  for (const [pathKey, ops] of Object.entries(paths)) {
    const pathLevelParams = ((ops as any).parameters as any[]) ?? [];

    for (const [method, opDef] of Object.entries(ops as Record<string, any>)) {
      if (!["get", "post", "put", "delete", "patch", "options", "head"].includes(method)) continue;

      const opParams = ((opDef as any).parameters as any[]) ?? [];
      const mergedParams = [...pathLevelParams, ...opParams]
        .map((p) => ({
          name: p.name as string,
          in: p.in as Parameter["in"],
          required: Boolean(p.required),
          example: p.example,
        }))
        .filter((p) => p.name && p.in);

      const id = `${specPrefix}${method}-${pathKey.replace(/[^a-zA-Z0-9]/g, "-")}`;
      operations.push({
        id,
        method,
        path: baseUrl ? `${baseUrl}${pathKey}` : pathKey,
        summary: (opDef as any).summary,
        description: (opDef as any).description,
        parameters: mergedParams,
      });
    }
  }

  return operations;
}

export function getOperationGroups(spec: OpenAPIDocument, opts?: { specKey?: string; titleOverride?: string }) {
  const paths = (spec.paths as Record<string, any>) ?? {};
  const groups: { title: string; items: { id: string; label: string; method: string; path: string }[] }[] = [];
  const specPrefix = opts?.specKey ? `${opts.specKey}-` : "";

  for (const [pathKey, ops] of Object.entries(paths)) {
    const opEntries = Object.entries(ops as Record<string, any>)
      .filter((entry) => ["get", "post", "put", "delete", "patch", "options", "head"].includes(entry[0] as string))
      .map(([method, opDef]) => {
        const id = `${specPrefix}${method}-${pathKey.replace(/[^a-zA-Z0-9]/g, "-")}`;
        return {
          id,
          method,
          path: pathKey,
          label: (opDef as any).summary ?? `${(method as string).toUpperCase()} ${pathKey}`,
        };
      });

    if (opEntries.length) {
      groups.push({ title: pathKey, items: opEntries });
    }
  }

  // Optionally wrap under a spec-level title
  if (opts?.titleOverride) {
    return [{ title: opts.titleOverride, items: [] }, ...groups];
  }
  return groups;
}
