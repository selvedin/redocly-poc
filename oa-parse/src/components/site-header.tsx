import ThemeToggle from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex w-full items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-slate-900 px-2 py-1 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
            {siteConfig.shortName}
          </span>
          <div>
            <p className="text-sm font-semibold">{siteConfig.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {siteConfig.tagline}
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400" />
        <ThemeToggle />
      </div>
    </header>
  );
}
