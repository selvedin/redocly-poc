import { memo } from "react";
import Button from "@/components/ui/button";

export type HeaderActionsProps = {
  onToggleAuth: () => void;
  onTryIt: () => void;
};

function HeaderActionsBase({ onToggleAuth, onTryIt }: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onToggleAuth} label="Authorize" />
      <Button variant="primary" size="sm" onClick={onTryIt} label="Try it" />
    </div>
  );
}

export const HeaderActions = memo(HeaderActionsBase);

