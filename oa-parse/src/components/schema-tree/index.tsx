import { useOpenState, useResolvedSchema } from "@/components/schema-tree/hooks";
import type { NodeProps, Schema } from "@/components/schema-tree/types";
import { NodeHeader } from "@/components/schema-tree/node-header";
import { useMemo } from "react";

function Node({ name, schema, required, depth = 0, expandAll = false, resolveRef }: NodeProps) {
  const resolvedSchema = useResolvedSchema(schema, resolveRef);

  const type = resolvedSchema?.type as string | undefined;
  const format = resolvedSchema?.format as string | undefined;
  const description = resolvedSchema?.description as string | undefined;
  const example = resolvedSchema?.example;
  const enums = resolvedSchema?.enum as (string | number)[] | undefined;
  const props = (resolvedSchema?.properties as Record<string, any>) ?? {};
  const req = Array.isArray(resolvedSchema?.required) ? (resolvedSchema?.required as string[]) : [];

  const constraints = useMemo(() => {
    const entries: { label: string; value: string | number }[] = [];
    if (resolvedSchema?.minimum !== undefined) entries.push({ label: "min", value: resolvedSchema.minimum });
    if (resolvedSchema?.maximum !== undefined) entries.push({ label: "max", value: resolvedSchema.maximum });
    if (resolvedSchema?.minLength !== undefined) entries.push({ label: "minLength", value: resolvedSchema.minLength });
    if (resolvedSchema?.maxLength !== undefined) entries.push({ label: "maxLength", value: resolvedSchema.maxLength });
    if (resolvedSchema?.pattern) entries.push({ label: "pattern", value: resolvedSchema.pattern });
    return entries;
  }, [resolvedSchema]);

  const hasChildren =
    (type === "object" && Object.keys(props).length > 0) ||
    (type === "array" && resolvedSchema.items) ||
    resolvedSchema.oneOf ||
    resolvedSchema.anyOf ||
    resolvedSchema.allOf;

  const { open, setOpen } = useOpenState(depth, expandAll);

  const renderChild = (childName: string, childSchema: any, key: string, reqFlag: boolean) => (
    <div key={key} className="relative pl-4">
      <div className="absolute left-1 top-0 h-full border-l border-slate-700/50" />
      <Node name={childName} schema={childSchema} required={reqFlag} depth={depth + 1} expandAll={expandAll} resolveRef={resolveRef} />
    </div>
  );

  const arrayItemType = resolvedSchema?.items?.type as string | undefined;

  return (
    <div className="space-y-1 rounded-md bg-[#0f1115] px-2 py-2 text-sm text-slate-200 shadow-sm ring-1 ring-slate-800/60">
      {name !== undefined && (
        <NodeHeader
          name={name}
          hasChildren={hasChildren}
          open={open}
          onToggle={() => setOpen((v) => !v)}
          typeLabel={type === "array" && arrayItemType ? `${type}<${arrayItemType}>` : type}
          format={format}
          constraints={constraints}
          required={required}
          description={description}
          example={example}
          enums={enums}
        />
      )}

      {open && type === "object" && Object.keys(props).length > 0 ? (
        <div className="mt-2 space-y-3">
          {Object.entries(props).map(([childName, childSchema]) => renderChild(childName, childSchema, `prop-${childName}`, req.includes(childName)))}
        </div>
      ) : null}

      {open && type === "array" && resolvedSchema.items ? (
        <div className="mt-2">
          {renderChild("[item]", resolvedSchema.items, "array-item", true)}
        </div>
      ) : null}

      {open && (resolvedSchema.oneOf || resolvedSchema.anyOf || resolvedSchema.allOf) ? (
        <div className="mt-3 space-y-2">
          {resolvedSchema.oneOf ? <div className="text-xs uppercase tracking-wide text-slate-400">oneOf</div> : null}
          {resolvedSchema.oneOf ? (
            <div className="space-y-2">
              {resolvedSchema.oneOf.map((s: any, i: number) => renderChild(`option ${i + 1}`, s, `oneOf-${i}`, false))}
            </div>
          ) : null}
          {resolvedSchema.anyOf ? <div className="text-xs uppercase tracking-wide text-slate-400">anyOf</div> : null}
          {resolvedSchema.anyOf ? (
            <div className="space-y-2">
              {resolvedSchema.anyOf.map((s: any, i: number) => renderChild(`option ${i + 1}`, s, `anyOf-${i}`, false))}
            </div>
          ) : null}
          {resolvedSchema.allOf ? <div className="text-xs uppercase tracking-wide text-slate-400">allOf</div> : null}
          {resolvedSchema.allOf ? (
            <div className="space-y-2">
              {resolvedSchema.allOf.map((s: any, i: number) => renderChild(`option ${i + 1}`, s, `allOf-${i}`, false))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function SchemaTree({ schema, expandAll = false, resolveRef }: { schema?: Schema; expandAll?: boolean; resolveRef?: (ref: string) => Schema | undefined }) {
  if (!schema) return null;
  return (
    <div className="rounded-lg border border-slate-800 bg-[#0c0e12] p-4 text-sm text-slate-200 shadow-sm">
      <Node schema={schema} expandAll={expandAll} resolveRef={resolveRef} />
    </div>
  );
}
