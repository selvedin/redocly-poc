export type Schema = any;

export type ResolveRef = (ref: string) => Schema | undefined;

export type NodeProps = {
  name?: string;
  schema: Schema;
  required?: boolean;
  depth?: number;
  expandAll?: boolean;
  resolveRef?: ResolveRef;
};

