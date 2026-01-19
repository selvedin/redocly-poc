import { memo } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";
import { MethodBadge } from "@/components/ui/method-badge";
import type { SpecNav } from "@/components/sidebar/types";

export type SpecSectionProps = {
  spec: SpecNav;
  isOpen: boolean;
  activeOp?: string;
  onToggle: () => void;
};

function SpecSectionBase({ spec, isOpen, activeOp, onToggle }: SpecSectionProps) {
  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        onClick={onToggle}
      >
        <span>{spec.title}</span>
        <span className="text-lg leading-none">{isOpen ? "−" : "+"}</span>
      </Button>
      {isOpen ? (
        <div className="space-y-1">
          {spec.groups.flatMap((group) =>
            group.items.map((item) => (
              <Link
                key={item.id}
                href={{ pathname: "/", query: { spec: spec.key, op: item.id } }}
                className={`flex items-center justify-between rounded-md px-2 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${item.id === activeOp ? "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" : ""}`}
              >
                <span className="truncate">{item.label}</span>
                <MethodBadge method={item.method} />
              </Link>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export const SpecSection = memo(SpecSectionBase);

