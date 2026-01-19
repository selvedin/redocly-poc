import { memo } from "react";
import { methodBadgeClass } from "@/components/search/utils";

export const MethodBadge = memo(function MethodBadge({ method }: { method: string }) {
  return <span className={methodBadgeClass(method)}>{method}</span>;
});

