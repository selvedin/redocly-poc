import type { SearchDoc } from "@/lib/search";

export type OperationLink = {
  id: string;
  label: string;
  method: string;
  path: string;
};

export type SpecNav = {
  key: string;
  title: string;
  groups: { title: string; items: OperationLink[] }[];
};

export type SidebarProps = {
  specs: SpecNav[];
  activeSpec?: string;
  activeOp?: string;
  searchDocs: SearchDoc[];
};

