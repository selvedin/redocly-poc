import { OperationCard } from "@/components/operation-card";
import type { Operation } from "@/lib/openapi/load";

export default function OperationList({ operations }: { operations: Operation[] }) {
  if (!operations.length) return null;
  return (
    <div className="mt-8 grid gap-4">
      {operations.map((op) => (
        <div key={op.id}>
          <OperationCard op={op} />
        </div>
      ))}
    </div>
  );
}

