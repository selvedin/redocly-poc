export const dynamic = "force-dynamic";

import { Sidebar } from "@/components/sidebar";
import { OperationCard } from "@/components/operation-card";
import { getOperationGroups, getOperations } from "@/lib/openapi/load";
import { listSpecs } from "@/lib/openapi/specs";

export default async function Home({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const specs = await listSpecs();
  const specNav = specs.map((s) => ({
    key: s.key,
    title: s.title,
    groups: getOperationGroups(s.spec, { specKey: s.key }),
  }));

  const params = (await searchParams) ?? {};
  const specParam = typeof params.spec === "string" ? params.spec : undefined;
  const opParam = typeof params.op === "string" ? params.op : undefined;
  const activeKey = specParam ?? specs[0]?.key;
  const activeSpec = specs.find((s) => s.key === activeKey);
  const activeInfo = (activeSpec?.spec as any)?.info ?? {};
  const allOps = activeSpec ? getOperations(activeSpec.spec, { specKey: activeSpec.key }) : [];
  const operations = opParam ? allOps.filter((o) => o.id === opParam) : [];

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar specs={specNav} activeSpec={activeKey} activeOp={opParam} />

      <section className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Version: {activeInfo?.version ?? "n/a"}</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{activeSpec?.title ?? "OpenAPI Spec"}</h1>
          {activeInfo?.description ? (
            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{activeInfo.description}</p>
          ) : null}
        </div>

        {operations.length > 0 && (
          <div className="mt-8 grid gap-4">
            {operations.map((op) => (
              <div key={op.id}>
                <OperationCard op={op} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
