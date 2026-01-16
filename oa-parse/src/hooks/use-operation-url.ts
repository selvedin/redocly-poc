import { useMemo } from "react";
import type { Parameter } from "@/lib/openapi/load";

export function useOperationUrl(path: string, values: Record<string, string>, parameters: Parameter[]) {
  return useMemo(() => {
    let url = path;

    parameters
      .filter((p) => p.in === "path")
      .forEach((p) => {
        const val = values[p.name] ?? String(p.example ?? "");
        url = url.replace(new RegExp(`{${p.name}}`, "g"), encodeURIComponent(val));
      });

    const queryParts = parameters
      .filter((p) => p.in === "query")
      .map((p) => {
        const val = values[p.name];
        if (val && val.length > 0) {
          return `${encodeURIComponent(p.name)}=${encodeURIComponent(val)}`;
        }
        return null;
      })
      .filter(Boolean) as string[];

    if (queryParts.length > 0) {
      url += (url.includes("?") ? "&" : "?") + queryParts.join("&");
    }

    return url;
  }, [path, values, parameters]);
}

