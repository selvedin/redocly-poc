import { memo } from "react";
import Button from "@/components/ui/button";

export type AuthPanelProps = {
  authToken: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
};

function AuthPanelBase({ authToken, onChange, onGenerate }: AuthPanelProps) {
  return (
    <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Authorization (Bearer)</span>
        <Button variant="outline" size="xs" onClick={onGenerate} label="Generate demo token" />
      </div>
      <textarea
        className="h-16 w-full rounded border border-slate-300 bg-white px-2 py-1 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        placeholder="Paste or generate a JWT"
        value={authToken}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-[11px] text-slate-500 dark:text-slate-400">Applied to all Try it requests as Authorization: Bearer &lt;token&gt;</p>
    </div>
  );
}

export const AuthPanel = memo(AuthPanelBase);

