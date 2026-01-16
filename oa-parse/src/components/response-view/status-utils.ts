export type Tone = "green" | "amber" | "red" | "blue";

export function statusTone(status?: string): Tone {
  if (!status) return "blue";
  if (status.startsWith("2")) return "green";
  if (status.startsWith("3")) return "blue";
  if (status.startsWith("4")) return "amber";
  if (status.startsWith("5")) return "red";
  return "blue";
}

const base = "rounded border px-2 py-1 transition text-xs";

const activeClasses: Record<Tone, string> = {
  green: `${base} border-green-600 bg-green-600 text-white dark:border-green-400 dark:bg-green-400 dark:text-slate-900`,
  amber: `${base} border-amber-600 bg-amber-600 text-white dark:border-amber-400 dark:bg-amber-400 dark:text-slate-900`,
  red: `${base} border-rose-600 bg-rose-600 text-white dark:border-rose-400 dark:bg-rose-400 dark:text-slate-900`,
  blue: `${base} border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900`,
};

const idleClasses: Record<Tone, string> = {
  green: `${base} border-green-200 bg-white text-green-700 hover:bg-green-50 dark:border-green-700 dark:bg-slate-900 dark:text-green-300 dark:hover:bg-slate-800`,
  amber: `${base} border-amber-200 bg-white text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-slate-800`,
  red: `${base} border-rose-200 bg-white text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-slate-800`,
  blue: `${base} border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`,
};

export function tabClasses(active: boolean, tone: Tone) {
  return active ? activeClasses[tone] : idleClasses[tone];
}

