import clsx from "clsx";
import { methodBadgeColors } from "@/config/method-styles";

export default function MethodPill({ method }: { method: string }) {
  const color = methodBadgeColors[method.toLowerCase()] ?? methodBadgeColors.default;
  return (
    <span className={clsx("mt-1 rounded-md px-2 py-1 text-xs font-semibold uppercase", color)}>
      {method}
    </span>
  );
}

