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

export type RequestBodySample = string | undefined;

type Components = { schemas?: Record<string, any> };

export type ResponseInfo = {
  status: string;
  description?: string;
  schema?: any;
  example?: string;
  contentType?: string;
};

export type Operation = {
  id: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  tags: string[];
  parameters: Parameter[];
  requestBodyRequired?: boolean;
  requestBodyContentTypes?: string[];
  requestBodySample?: RequestBodySample;
  requestBodySchema?: any;
  requestBodyExample?: string;
  responses: ResponseInfo[];
};

function pickRequestExample(requestBody: any): any {
  const json = requestBody?.content?.["application/json"];
  if (!json) return undefined;
  if (json.example !== undefined) return json.example;
  const examples = json.examples;
  if (examples && typeof examples === "object") {
    const first = Object.values(examples)[0] as any;
    if (first?.value !== undefined) return first.value;
  }
  return undefined;
}

function pickRequestContentTypes(requestBody: any): string[] {
  const c = requestBody?.content;
  return c && typeof c === "object" ? Object.keys(c) : [];
}

function resolveSchema(schema: any, components: Components, seen = new Set<string>()): any {
  if (!schema || typeof schema !== "object") return schema;
  if (schema.$ref && typeof schema.$ref === "string") {
    const ref = schema.$ref as string;
    const match = ref.match(/^#\/components\/schemas\/(.+)$/);
    if (match && components.schemas) {
      const key = match[1];
      if (seen.has(key)) return { type: "object", description: "Cyclic $ref" };
      const target = components.schemas[key];
      if (!target) return { type: "object", description: `Unresolved $ref ${ref}` };
      seen.add(key);
      return resolveSchema(target, components, seen);
    }
  }
  // clone and resolve nested
  const resolved: any = Array.isArray(schema) ? [] : { ...schema };
  if (schema.properties && typeof schema.properties === "object") {
    resolved.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([k, v]) => [k, resolveSchema(v, components, new Set(seen))])
    );
  }
  if (schema.items) {
    resolved.items = resolveSchema(schema.items, components, new Set(seen));
  }
  if (schema.oneOf) resolved.oneOf = schema.oneOf.map((s: any) => resolveSchema(s, components, new Set(seen)));
  if (schema.anyOf) resolved.anyOf = schema.anyOf.map((s: any) => resolveSchema(s, components, new Set(seen)));
  if (schema.allOf) resolved.allOf = schema.allOf.map((s: any) => resolveSchema(s, components, new Set(seen)));
  return resolved;
}

function buildExampleFromSchema(schema: any, components: Components): any {
  const resolved = resolveSchema(schema, components);
  if (!resolved || typeof resolved !== "object") return undefined;
  if (resolved.example !== undefined) return resolved.example;
  const t = resolved.type as string | undefined;
  if (t === "object") {
    const result: Record<string, any> = {};
    const props = (resolved.properties as Record<string, any>) ?? {};
    const required: string[] = Array.isArray(resolved.required) ? resolved.required : [];
    for (const [key, propSchema] of Object.entries(props)) {
      const val = buildExampleFromSchema(propSchema, components);
      result[key] = val !== undefined ? val : defaultForType(propSchema?.type, required.includes(key));
    }
    return result;
  }
  if (t === "array") {
    const item = buildExampleFromSchema(resolved.items, components);
    return [item !== undefined ? item : defaultForType(resolved.items?.type, true)];
  }
  return defaultForType(t, true);
}

function defaultForType(type: any, required: boolean) {
  switch (type) {
    case "string":
      return required ? "string" : "";
    case "number":
    case "integer":
      return required ? 0 : undefined;
    case "boolean":
      return required ? true : undefined;
    default:
      return undefined;
  }
}

export function getOperations(spec: OpenAPIDocument, opts?: { specKey?: string }): Operation[] {
  const paths = (spec.paths as Record<string, any>) ?? {};
  const operations: Operation[] = [];
  const servers = (spec.servers as any[]) ?? [];
  const baseUrl: string | undefined = servers[0]?.url;
  const specPrefix = opts?.specKey ? `${opts.specKey}-` : "";
  const components: Components = { schemas: (spec.components as any)?.schemas };

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

      // requestBody schema, example, sample
      let requestBodySample: RequestBodySample = undefined;
      let requestBodySchema: any = undefined;
      let requestBodyExample: string | undefined = undefined;
      const requestBody = (opDef as any).requestBody;
      const requestBodyRequired = Boolean(requestBody?.required);
      const requestBodyContentTypes = pickRequestContentTypes(requestBody);
      const rawSchema = requestBody?.content?.["application/json"]?.schema;
      const pickedExample = pickRequestExample(requestBody);
      if (pickedExample !== undefined) {
        try {
          requestBodyExample = JSON.stringify(pickedExample, null, 2);
        } catch (e) {
          requestBodyExample = undefined;
        }
      }
      if (rawSchema) {
        const resolvedSchema = resolveSchema(rawSchema, components);
        requestBodySchema = resolvedSchema;
        const exampleObj = buildExampleFromSchema(resolvedSchema, components);
        if (exampleObj !== undefined) {
          try {
            requestBodySample = JSON.stringify(exampleObj, null, 2);
          } catch (e) {
            requestBodySample = undefined;
          }
        }
      }

      // responses
      const responses: ResponseInfo[] = [];
      const rawResponses = (opDef as any).responses ?? {};
      for (const [status, respDef] of Object.entries(rawResponses)) {
        const desc = (respDef as any).description as string | undefined;
        const contentEntries = respDef?.content && typeof respDef.content === "object" ? Object.entries(respDef.content) : [];
        const firstContent = contentEntries[0] as [string, any] | undefined;
        const contentType = firstContent?.[0];
        const content = firstContent?.[1];
        let schemaResolved: any = undefined;
        let exampleStr: string | undefined = undefined;
        if (content?.schema) {
          schemaResolved = resolveSchema(content.schema, components);
          const exampleFromSchema = buildExampleFromSchema(schemaResolved, components);
          if (content.example !== undefined) {
            try {
              exampleStr = JSON.stringify(content.example, null, 2);
            } catch (e) {
              exampleStr = undefined;
            }
          } else if (content.examples && typeof content.examples === "object") {
            const first = Object.values(content.examples)[0] as any;
            if (first?.value !== undefined) {
              try {
                exampleStr = JSON.stringify(first.value, null, 2);
              } catch (e) {
                exampleStr = undefined;
              }
            }
          } else if (exampleFromSchema !== undefined) {
            try {
              exampleStr = JSON.stringify(exampleFromSchema, null, 2);
            } catch (e) {
              exampleStr = undefined;
            }
          }
        }
        responses.push({ status, description: desc, schema: schemaResolved, example: exampleStr, contentType });
      }

      const id = `${specPrefix}${method}-${pathKey.replace(/[^a-zA-Z0-9]/g, "-")}`;
      operations.push({
        id,
        method,
        path: baseUrl ? `${baseUrl}${pathKey}` : pathKey,
        summary: (opDef as any).summary,
        description: (opDef as any).description,
        tags: Array.isArray((opDef as any).tags) ? (opDef as any).tags : [],
        parameters: mergedParams,
        requestBodyRequired,
        requestBodyContentTypes,
        requestBodySample,
        requestBodySchema,
        requestBodyExample,
        responses,
      });
    }
  }

  return operations;
}

export function getOperationGroups(spec: OpenAPIDocument, opts?: { specKey?: string; titleOverride?: string }) {
  const paths = (spec.paths as Record<string, any>) ?? {};
  const specPrefix = opts?.specKey ? `${opts.specKey}-` : "";
  const groupsMap: Record<string, { title: string; items: { id: string; label: string; method: string; path: string }[] }> = {};

  for (const [pathKey, ops] of Object.entries(paths)) {
    for (const [method, opDef] of Object.entries(ops as Record<string, any>)) {
      if (!["get", "post", "put", "delete", "patch", "options", "head"].includes(method)) continue;
      const id = `${specPrefix}${method}-${pathKey.replace(/[^a-zA-Z0-9]/g, "-")}`;
      const tags = Array.isArray((opDef as any).tags) && (opDef as any).tags.length ? (opDef as any).tags : ["General"];
      const label = (opDef as any).summary ?? `${(method as string).toUpperCase()} ${pathKey}`;
      for (const tag of tags) {
        if (!groupsMap[tag]) groupsMap[tag] = { title: tag, items: [] };
        groupsMap[tag].items.push({ id, method, path: pathKey, label });
      }
    }
  }

  const groups = Object.values(groupsMap);
  if (opts?.titleOverride) {
    return [{ title: opts.titleOverride, items: [] }, ...groups];
  }
  return groups;
}
