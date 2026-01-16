import { languageOptions } from "@/config/code-samples";
import type { Language } from "@/lib/codegen/templates";

export default function LanguageSelect({ value, onChange }: { value: Language; onChange: (lang: Language) => void }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <label className="text-slate-600 dark:text-slate-300" htmlFor="lang-select">
        Language
      </label>
      <select
        id="lang-select"
        className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
      >
        {languageOptions.map((l) => (
          <option key={l.key} value={l.key}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}

