import { memo } from "react";
import Button from "@/components/ui/button";

export type HeaderActionsProps = {
  onToggleAuth: () => void;
  onTryIt: () => void;
};

function HeaderActionsBase({ onToggleAuth, onTryIt }: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-[color:var(--muted-foreground)] dark:text-slate-400">
      <button className="underline underline-offset-4" onClick={onToggleAuth}>
        Auth
      </button>
      <span aria-hidden className="text-[color:var(--muted-foreground)] dark:text-slate-600">
        |
      </span>
      <button className="underline underline-offset-4" onClick={onTryIt}>
        Try it
      </button>
    </div>
  );
}

export const HeaderActions = memo(HeaderActionsBase);

