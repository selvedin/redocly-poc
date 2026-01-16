export const dynamic = "force-dynamic";

import ClientShell from "@/components/client-shell";
import { getOperationGroups, getOperations } from "@/lib/openapi/load";
import { listSpecs } from "@/lib/openapi/specs";
import { buildSearchDocs } from "@/lib/search";

export default async function Home() {
  const specs = await listSpecs();
  const specNav = specs.map((s) => ({
    key: s.key,
    title: s.title,
    groups: getOperationGroups(s.spec, { specKey: s.key }),
  }));

  const specOps = specs.map((s) => ({ key: s.key, ops: getOperations(s.spec, { specKey: s.key }) }));

  const specMeta = specs.map((s) => {
    const info = (s.spec as any)?.info ?? {};
    return { key: s.key, title: s.title, version: info.version, description: info.description };
  });

  const searchDocs = specOps.flatMap((s) => buildSearchDocs(s.key, s.ops));

  return (
    <ClientShell
      specNav={specNav}
      specMeta={specMeta}
      specOps={specOps}
      searchDocs={searchDocs}
      defaultSpecKey={specs[0]?.key ?? ""}
    />
  );
}
