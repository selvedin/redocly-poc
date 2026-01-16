import { useEffect, useMemo, useState } from "react";
import type { Schema, ResolveRef } from "@/components/schema-tree/types";

export function useResolvedSchema(schema: Schema, resolveRef?: ResolveRef) {
  return useMemo(() => {
    if (schema && schema.$ref && resolveRef) {
      const refSchema = resolveRef(schema.$ref);
      if (refSchema) return refSchema;
    }
    return schema;
  }, [schema, resolveRef]);
}

export function useOpenState(depth: number, expandAll?: boolean) {
  const [open, setOpen] = useState<boolean>(Boolean(expandAll) || depth < 2);
  useEffect(() => {
    setOpen(Boolean(expandAll));
  }, [expandAll]);
  return { open, setOpen } as const;
}

