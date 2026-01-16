import { useEffect, useMemo, useState } from "react";

type Schema = any;

type NodeProps = {
  name?: string;
  schema: Schema;
  required?: boolean;
  depth?: number;
  expandAll?: boolean;
  resolveRef?: (ref: string) => Schema | undefined;
};

function TypeBadge({ type }: { type?: string }) {
  if (!type) return null;
  return (
    <span className="ml-2 rounded bg-slate-100 px-1 py-[1px] text-[10px] uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {type}
    </span>
  );
}

function Constraint({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="ml-2 rounded bg-slate-100 px-1 py-[1px] text-[10px] uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {label}: {value}
    </span>
  );
}

function EnumChips({ values }: { values: (string | number)[] }) {
  if (!values?.length) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
      {values.map((v, i) => (
        <span key={i} className="rounded bg-slate-100 px-2 py-[1px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {String(v)}
        </span>
      ))}
    </div>
  );
}

function Node({ name, schema, required, depth = 0, expandAll = false, resolveRef }: NodeProps) {
  const resolvedSchema = useMemo(() => {
    if (schema && schema.$ref && resolveRef) {
      const refSchema = resolveRef(schema.$ref);
      if (refSchema) return refSchema;
    }
    return schema;
  }, [schema, resolveRef]);

  const type = resolvedSchema?.type as string | undefined;
  const format = resolvedSchema?.format as string | undefined;
  const description = resolvedSchema?.description as string | undefined;
  const example = resolvedSchema?.example;
  const enums = resolvedSchema?.enum as (string | number)[] | undefined;
  const props = (resolvedSchema?.properties as Record<string, any>) ?? {};
  const req = Array.isArray(resolvedSchema?.required) ? (resolvedSchema?.required as string[]) : [];
  const constraints: (string | number)[] = [];
  const constraintLabels: string[] = [];
  if (resolvedSchema?.minimum !== undefined) {
    constraints.push(resolvedSchema.minimum);
    constraintLabels.push("min");
  }
  if (resolvedSchema?.maximum !== undefined) {
    constraints.push(resolvedSchema.maximum);
    constraintLabels.push("max");
  }
  if (resolvedSchema?.minLength !== undefined) {
    constraints.push(resolvedSchema.minLength);
    constraintLabels.push("minLength");
  }
  if (resolvedSchema?.maxLength !== undefined) {
    constraints.push(resolvedSchema.maxLength);
    constraintLabels.push("maxLength");
  }
  if (resolvedSchema?.pattern) {
    constraints.push(resolvedSchema.pattern);
    constraintLabels.push("pattern");
  }

  const hasChildren =
    (type === "object" && Object.keys(props).length > 0) ||
    (type === "array" && resolvedSchema.items) ||
    resolvedSchema.oneOf ||
    resolvedSchema.anyOf ||
    resolvedSchema.allOf;
  const [open, setOpen] = useState<boolean>(Boolean(expandAll) || depth < 2);
  useEffect(() => {
    setOpen(Boolean(expandAll));
  }, [expandAll]);

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
        <div className="flex items-start gap-2">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mt-[2px] flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 text-[11px] text-slate-200 hover:border-slate-400 hover:text-slate-100"
              aria-label={open ? "Collapse" : "Expand"}
            >
              {open ? "−" : "+"}
            </button>
          ) : (
            <span className="mt-[2px] h-5 w-5" />
          )}
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex flex-wrap items-center gap-2 leading-tight">
              <span className="font-medium text-slate-200">{name}</span>
              <TypeBadge type={type === "array" && arrayItemType ? `${type}<${arrayItemType}>` : type} />
              {format ? <Constraint label="fmt" value={format} /> : null}
              {constraints.map((v, i) => (
                <div key={`${name}-c-${i}`}>
                  <Constraint label={constraintLabels[i]} value={v} />
                </div>
              ))}
              {required ? <span className="rounded bg-transparent text-[11px] font-semibold uppercase text-[#ef4444]">required</span> : null}
            </div>
            {description ? <p className="text-xs text-slate-400">{description}</p> : null}
            {example !== undefined ? (
              <div className="text-xs text-slate-400">
                Example: <code className="rounded bg-[#1f2933] px-2 py-[1px] font-mono text-slate-100">{String(example)}</code>
              </div>
            ) : null}
            {enums ? <EnumChips values={enums} /> : null}
          </div>
        </div>
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
