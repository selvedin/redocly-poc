import Link from "next/link";

type OperationLink = {
  id: string;
  label: string;
  method: string;
  path: string;
};

type SpecNav = {
  key: string;
  title: string;
  groups: { title: string; items: OperationLink[] }[];
};

export function Sidebar({ specs, activeSpec }: { specs: SpecNav[]; activeSpec?: string }) {
  return (
    <aside className="hidden h-fit min-w-[240px] rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 lg:block">
      <div className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Navigation</div>
      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
        {specs.map((spec) => (
          <div key={spec.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Link
                href={{ pathname: "/", query: { spec: spec.key } }}
                className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 hover:underline dark:text-slate-400"
              >
                {spec.title}
              </Link>
              {activeSpec === spec.key ? (
                <span className="rounded bg-slate-100 px-2 py-[2px] text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Active
                </span>
              ) : null}
            </div>
            <div className="space-y-1">
              {spec.groups.flatMap((group) =>
                group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={{ pathname: "/", query: { spec: spec.key, op: item.id } }}
                    className="flex items-center justify-between rounded-md px-2 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="ml-2 shrink-0 rounded-full bg-slate-900 px-2 py-[2px] text-[10px] font-semibold uppercase text-white dark:bg-white dark:text-slate-900">
                      {item.method}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
