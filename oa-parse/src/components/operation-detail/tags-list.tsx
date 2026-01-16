import { memo } from "react";

export function TagsList({ tags }: { tags?: string[] }) {
  if (!tags?.length) return <div className="h-[24px]" />;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {tags.map((t) => (
        <span key={t} className="rounded bg-slate-100 px-2 py-[2px] text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {t}
        </span>
      ))}
    </div>
  );
}

export default memo(TagsList);

