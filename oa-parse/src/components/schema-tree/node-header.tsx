import { memo } from "react";
import { ConstraintBadge, TypeBadge } from "@/components/ui/badges";
import { EnumChips } from "@/components/ui/enum-chips";

export type ConstraintEntry = { label: string; value: string | number };

export type NodeHeaderProps = {
  name: string;
  hasChildren: boolean;
  open: boolean;
  onToggle: () => void;
  typeLabel?: string;
  format?: string;
  constraints?: ConstraintEntry[];
  required?: boolean;
  description?: string;
  example?: unknown;
  enums?: (string | number)[];
};

function NodeHeaderBase({
  name,
  hasChildren,
  open,
  onToggle,
  typeLabel,
  format,
  constraints = [],
  required,
  description,
  example,
  enums,
}: NodeHeaderProps) {
  return (
    <div className="flex items-start gap-2">
      {hasChildren ? (
        <button
          type="button"
          onClick={onToggle}
          className="mt-[2px] flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 text-[11px] text-slate-200 hover:border-slate-400 hover:text-slate-100"
          aria-label={open ? "Collapse" : "Expand"}
        >
          {open ? "−" : "+"}
        </button>
      ) : (
        <span className="mt-[2px] h-5 w-5" />
      )}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2 leading-tight">
          <span className="font-medium text-slate-200">{name}</span>
          <TypeBadge type={typeLabel} />
          {format ? <ConstraintBadge label="fmt" value={format} /> : null}
          {constraints.map((c, i) => (
            <ConstraintBadge key={`${name}-c-${i}`} label={c.label} value={c.value} />
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
  );
}

export const NodeHeader = memo(NodeHeaderBase);

