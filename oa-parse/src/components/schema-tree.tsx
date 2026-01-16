import { useEffect, useState } from "react";

type Schema = any;

type NodeProps = {
  name?: string;
  schema: Schema;
  required?: boolean;
  depth?: number;
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

function Node({ name, schema, required, depth = 0, expandAll = false }: NodeProps & { expandAll?: boolean }) {
  const type = schema?.type as string | undefined;
  const format = schema?.format as string | undefined;
  const description = schema?.description as string | undefined;
  const example = schema?.example;
  const props = (schema?.properties as Record<string, any>) ?? {};
  const req = Array.isArray(schema?.required) ? (schema?.required as string[]) : [];
  const constraints: (string | number)[] = [];
  const constraintLabels: string[] = [];
  if (schema?.minimum !== undefined) {
    constraints.push(schema.minimum);
    constraintLabels.push("min");
  }
  if (schema?.maximum !== undefined) {
    constraints.push(schema.maximum);
    constraintLabels.push("max");
  }
  if (schema?.minLength !== undefined) {
    constraints.push(schema.minLength);
    constraintLabels.push("minLength");
  }
  if (schema?.maxLength !== undefined) {
    constraints.push(schema.maxLength);
    constraintLabels.push("maxLength");
  }
  const hasChildren = (type === "object" && Object.keys(props).length > 0) || (type === "array" && schema.items);
  const [open, setOpen] = useState<boolean>(Boolean(expandAll) || depth < 2);
  useEffect(() => {
    setOpen(Boolean(expandAll));
  }, [expandAll]);

  const renderChild = (childName: string, childSchema: any, key: string, reqFlag: boolean) => (
    <div key={key}>
      <Node name={childName} schema={childSchema} required={reqFlag} depth={depth + 1} expandAll={expandAll} />
    </div>
  );

  return (
    <div className="space-y-1">
      {name !== undefined && (
        <div className="flex items-center text-sm">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mr-1 h-4 w-4 rounded border border-slate-300 text-[10px] leading-3 text-slate-600 dark:border-slate-700 dark:text-slate-200"
            >
              {open ? "-" : "+"}
            </button>
          ) : (
            <span className="mr-1 h-4 w-4" />
          )}
          <span className="font-mono text-xs text-slate-800 dark:text-slate-100">{name}</span>
          <TypeBadge type={type} />
          {format ? <Constraint label="fmt" value={format} /> : null}
          {constraints.map((v, i) => (
            <div key={`${name}-c-${i}`}>
              <Constraint label={constraintLabels[i]} value={v} />
            </div>
          ))}
          {required ? <span className="ml-2 text-rose-600">*</span> : null}
        </div>
      )}
      {description ? (
        <p className="text-xs text-slate-600 dark:text-slate-300">{description}</p>
      ) : null}
      {example !== undefined ? (
        <div className="text-xs text-slate-600 dark:text-slate-300">
          Example: <code className="bg-slate-100 px-1 py-[1px] dark:bg-slate-800">{String(example)}</code>
        </div>
      ) : null}

      {open && type === "object" && Object.keys(props).length > 0 ? (
        <div className="ml-4 border-l border-dashed border-slate-300 pl-3 dark:border-slate-700">
          {Object.entries(props).map(([childName, childSchema]) => renderChild(childName, childSchema, `prop-${childName}`, req.includes(childName)))}
        </div>
      ) : null}

      {open && type === "array" && schema.items ? (
        <div className="ml-4 border-l border-dashed border-slate-300 pl-3 dark:border-slate-700">
          <Node name={"[item]"} schema={schema.items} required depth={depth + 1} expandAll={expandAll} />
        </div>
      ) : null}

      {open && (schema.oneOf || schema.anyOf || schema.allOf) ? (
        <div className="mt-2 space-y-1">
          {schema.oneOf ? <div className="text-xs">oneOf:</div> : null}
          {schema.oneOf ? (
            <div className="ml-4 border-l border-dashed border-slate-300 pl-3 dark:border-slate-700">
              {schema.oneOf.map((s: any, i: number) => renderChild(`option ${i + 1}`, s, `oneOf-${i}`, false))}
            </div>
          ) : null}
          {schema.anyOf ? <div className="text-xs">anyOf:</div> : null}
          {schema.anyOf ? (
            <div className="ml-4 border-l border-dashed border-slate-300 pl-3 dark:border-slate-700">
              {schema.anyOf.map((s: any, i: number) => renderChild(`option ${i + 1}`, s, `anyOf-${i}`, false))}
            </div>
          ) : null}
          {schema.allOf ? <div className="text-xs">allOf:</div> : null}
          {schema.allOf ? (
            <div className="ml-4 border-l border-dashed border-slate-300 pl-3 dark:border-slate-700">
              {schema.allOf.map((s: any, i: number) => renderChild(`option ${i + 1}`, s, `allOf-${i}`, false))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function SchemaTree({ schema, expandAll = false }: { schema?: Schema; expandAll?: boolean }) {
  if (!schema) return null;
  return (
    <div className="rounded-md border border-slate-200 bg-white/80 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/60">
      <Node schema={schema} expandAll={expandAll} />
    </div>
  );
}
