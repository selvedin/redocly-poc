import type { Operation } from "@/lib/openapi/load";
import type { SearchDoc } from "@/lib/search";

export type SpecNav = {
  key: string;
  title: string;
  groups: { title: string; items: { id: string; label: string; method: string; path: string }[] }[];
};

export type SpecMeta = {
  key: string;
  title: string;
  version?: string;
  description?: string;
};

export type SpecOps = { key: string; ops: Operation[] };

export type ClientShellProps = {
  specNav: SpecNav[];
  specMeta: SpecMeta[];
  specOps: SpecOps[];
  searchDocs: SearchDoc[];
  defaultSpecKey: string;
};

