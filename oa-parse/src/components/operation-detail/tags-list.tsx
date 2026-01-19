import { memo } from "react";

function Tag({ tag }: { tag: string }) {
  return (
    <span className="rounded-full bg-[color:var(--muted)] px-3 py-1 text-xs font-medium text-[color:var(--foreground)] shadow-sm dark:bg-slate-800 dark:text-slate-200">
      {tag}
    </span>
  );
}

export function TagsList({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 text-[color:var(--muted-foreground)] dark:text-slate-400">
      {tags.map((t) => (
        <Tag key={t} tag={t} />
      ))}
    </div>
  );
}

export default memo(TagsList);
