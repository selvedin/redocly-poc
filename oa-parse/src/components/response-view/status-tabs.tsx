import { memo } from "react";
import type { ResponseInfo } from "@/lib/openapi/load";
import { statusTone, tabClasses } from "@/components/response-view/status-utils";
import Button from "@/components/ui/button";

export type StatusTabsProps = {
  responses: ResponseInfo[];
  activeStatus?: string;
  onSelect: (status: string) => void;
};

function StatusTabsBase({ responses, activeStatus, onSelect }: StatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {responses.map((resp) => {
        const tone = statusTone(resp.status);
        const isActive = activeStatus === resp.status;
        return (
          <Button
            key={resp.status}
            variant="ghost"
            size="xs"
            onClick={() => onSelect(resp.status)}
            className={tabClasses(isActive, tone)}
            label={resp.status}
          />
        );
      })}
    </div>
  );
}

export const StatusTabs = memo(StatusTabsBase);

