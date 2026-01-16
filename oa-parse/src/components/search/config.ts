import type Fuse from "fuse.js";
import type { SearchDoc } from "@/lib/search";

export const fuseOptions: Fuse.IFuseOptions<SearchDoc> = {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  keys: [
    { name: "summary", weight: 0.5 },
    { name: "description", weight: 0.3 },
    { name: "path", weight: 0.2 },
  ],
};

