import Fuse from "fuse.js";
import type { Operation } from "@/lib/openapi/load";

export type SearchDoc = {
  id: string;
  specKey: string;
  path: string;
  method: string;
  summary?: string;
  description?: string;
};

export type SearchIndex = {
  docs: SearchDoc[];
  fuse: Fuse<SearchDoc>;
};

const FUSE_OPTIONS: Fuse.IFuseOptions<SearchDoc> = {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  keys: [
    { name: "summary", weight: 0.5 },
    { name: "description", weight: 0.3 },
    { name: "path", weight: 0.2 },
  ],
};

export function buildSearchDocs(specKey: string, ops: Operation[]): SearchDoc[] {
  return ops.map((op) => ({
    id: op.id,
    specKey,
    path: op.path,
    method: op.method,
    summary: op.summary,
    description: op.description,
  }));
}

export function createSearchIndex(docs: SearchDoc[]): SearchIndex {
  const fuse = new Fuse(docs, FUSE_OPTIONS);
  return { docs, fuse };
}

export type SearchHit = {
  item: SearchDoc;
  score: number | undefined;
};

export function searchDocs(index: SearchIndex, query: string): SearchHit[] {
  if (!query.trim()) return [];
  return index.fuse.search(query).map((r) => ({ item: r.item, score: r.score }));
}

