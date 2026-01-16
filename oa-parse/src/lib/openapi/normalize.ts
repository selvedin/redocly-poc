import type { OpenAPIDocument } from "./load";

export type NormalizedSchema = any;

export type NormalizedParameter = {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required: boolean;
  schema?: NormalizedSchema;
  example?: unknown;
  description?: string;
};

export type NormalizedRequestBody = {
  required: boolean;
  contentTypes: string[];
  schema?: NormalizedSchema;
  example?: any;
  rawExample?: any;
};

export type NormalizedResponse = {
  status: string;
  description?: string;
  contentType?: string;
  schema?: NormalizedSchema;
  example?: any;
  rawExample?: any;
};

export type NormalizedOperation = {
  id: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  tags: string[];
  parameters: NormalizedParameter[];
  requestBody?: NormalizedRequestBody;
  responses: NormalizedResponse[];
  servers: string[];
};

export type NormalizedDocument = {
  title?: string;
  version?: string;
  servers: string[];
  operations: NormalizedOperation[];
  components: {
    schemas: Record<string, any>;
  };
  resolveRef: (ref: string) => NormalizedSchema | undefined;
};

function buildResolver(components: Record<string, any>) {
  const cache = new Map<string, any>();
  const resolveRef = (ref: string, seen = new Set<string>()): any => {
    const match = ref.match(/^#\/components\/schemas\/(.+)$/);
    if (!match) return undefined;
    const key = match[1];
    if (cache.has(key)) return cache.get(key);
    const target = components[key];
    if (!target) return undefined;
    if (seen.has(key)) return { type: "object", description: "Cyclic $ref" };
    seen.add(key);
    const resolved = resolveSchema(target, components, new Set(seen));
    cache.set(key, resolved);
    return resolved;
  };
  return resolveRef;
}

function resolveSchema(schema: any, components: Record<string, any>, seen: Set<string>): any {
  if (!schema || typeof schema !== "object") return schema;
  if (schema.$ref && typeof schema.$ref === "string") {
    const ref = schema.$ref as string;
    const match = ref.match(/^#\/components\/schemas\/(.+)$/);
    if (match) {
      const key = match[1];
      if (seen.has(key)) return { type: "object", description: "Cyclic $ref" };
      const target = components[key];
      if (!target) return { type: "object", description: `Unresolved $ref ${ref}` };
      return resolveSchema(target, components, new Set(seen).add(key));
    }
  }
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

function buildExampleFromSchema(schema: any, resolveRef: (ref: string) => any): any {
  if (!schema || typeof schema !== "object") return undefined;
  const withRefs = schema.$ref ? resolveRef(schema.$ref) ?? schema : schema;
  if (withRefs.example !== undefined) return withRefs.example;
  const t = withRefs.type as string | undefined;
  if (t === "object") {
    const result: Record<string, any> = {};
    const props = (withRefs.properties as Record<string, any>) ?? {};
    const required: string[] = Array.isArray(withRefs.required) ? withRefs.required : [];
    for (const [key, propSchema] of Object.entries(props)) {
      const val = buildExampleFromSchema(propSchema, resolveRef);
      result[key] = val !== undefined ? val : defaultForType(propSchema?.type, required.includes(key));
    }
    return result;
  }
  if (t === "array") {
    const item = buildExampleFromSchema(withRefs.items, resolveRef);
    return [item !== undefined ? item : defaultForType(withRefs.items?.type, true)];
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

export function normalize(spec: OpenAPIDocument, opts?: { specKey?: string }): NormalizedDocument {
  const specPrefix = opts?.specKey ? `${opts.specKey}-` : "";
  const components = ((spec as any).components?.schemas as Record<string, any>) ?? {};
  const resolveRef = buildResolver(components);
  const servers = Array.isArray((spec as any).servers) ? ((spec as any).servers as any[]).map((s) => s.url).filter(Boolean) : [];
  const baseUrl = servers[0];
  const paths = (spec as any).paths ?? {};
  const operations: NormalizedOperation[] = [];

  for (const [pathKey, ops] of Object.entries(paths)) {
    const pathLevelParams: any[] = (ops as any).parameters ?? [];

    for (const [method, opDef] of Object.entries(ops as Record<string, any>)) {
      if (!["get", "post", "put", "delete", "patch", "options", "head"].includes(method)) continue;

      const opParams: any[] = (opDef as any).parameters ?? [];
      const mergedParams = [...pathLevelParams, ...opParams]
        .filter((p) => p && p.name && p.in)
        .map((p) => ({
          name: p.name as string,
          in: p.in as NormalizedParameter["in"],
          required: Boolean(p.required),
          schema: p.schema ? resolveSchema(p.schema, components, new Set()) : undefined,
          example: p.example,
          description: p.description,
        }));

      const requestBody = (opDef as any).requestBody;
      let requestBodyNorm: NormalizedRequestBody | undefined = undefined;
      if (requestBody) {
        const contentTypes = requestBody?.content && typeof requestBody.content === "object" ? Object.keys(requestBody.content) : [];
        const jsonPart = requestBody?.content?.["application/json"];
        const reqSchema = jsonPart?.schema ? resolveSchema(jsonPart.schema, components, new Set()) : undefined;
        const reqExample = jsonPart?.example ?? jsonPart?.examples && Object.values(jsonPart.examples)[0]?.value;
        const builtExample = reqSchema ? buildExampleFromSchema(reqSchema, resolveRef) : undefined;
        requestBodyNorm = {
          required: Boolean(requestBody.required),
          contentTypes,
          schema: reqSchema,
          rawExample: reqExample,
          example: reqExample ?? builtExample,
        };
      }

      const responses: NormalizedResponse[] = [];
      const rawResponses = (opDef as any).responses ?? {};
      for (const [status, respDef] of Object.entries(rawResponses)) {
        const contentEntries = respDef?.content && typeof respDef.content === "object" ? Object.entries(respDef.content) : [];
        const firstContent = contentEntries[0] as [string, any] | undefined;
        const contentType = firstContent?.[0];
        const content = firstContent?.[1];
        const respSchema = content?.schema ? resolveSchema(content.schema, components, new Set()) : undefined;
        const rawExample = content?.example ?? (content?.examples && Object.values(content.examples)[0]?.value);
        const builtExample = respSchema ? buildExampleFromSchema(respSchema, resolveRef) : undefined;
        responses.push({
          status,
          description: (respDef as any).description,
          contentType,
          schema: respSchema,
          rawExample,
          example: rawExample ?? builtExample,
        });
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
        requestBody: requestBodyNorm,
        responses,
        servers,
      });
    }
  }

  const info = (spec as any).info ?? {};
  return {
    title: info.title,
    version: info.version,
    servers,
    components: { schemas: components },
    operations,
    resolveRef,
  };
}

