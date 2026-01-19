import { siteConfig } from "@/config/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-600 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
      {siteConfig.name}
    </footer>
  );
}
