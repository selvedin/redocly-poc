import clsx from "clsx";
import type { SearchDoc } from "@/lib/search";
import type { ReadonlyURLSearchParams } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function methodBadgeClass(method: string) {
  const m = method.toLowerCase();
  return clsx(
    "mt-[2px] rounded px-2 py-[2px] text-[11px] font-semibold uppercase",
    m === "get" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
    m === "post" && "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    m === "put" && "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
    m === "delete" && "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
    m === "patch" && "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
    !["get", "post", "put", "delete", "patch"].includes(m) && "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
  );
}

export function navigateToResult(
  router: AppRouterInstance,
  searchParams: ReadonlyURLSearchParams | null,
  item: SearchDoc,
  reset: () => void
) {
  reset();
  const params = new URLSearchParams(searchParams?.toString() ?? "");
  params.set("spec", item.specKey);
  params.set("op", item.id);
  router.replace(`/?${params.toString()}`, { scroll: false });
  setTimeout(() => {
    const el = document.getElementById(item.id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

