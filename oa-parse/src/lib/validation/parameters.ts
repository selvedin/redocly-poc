import type { Parameter } from "@/lib/openapi/load";

export function validateValue(value: string, param: Parameter): string | null {
  const schema = param.schema ?? {};
  if (param.required && value.trim() === "") return "Required";
  if (!value) return null;

  if (schema.type === "integer" && !/^[-]?\d+$/.test(value)) return "Must be an integer";
  if (schema.type === "number" && Number.isNaN(Number(value))) return "Must be a number";
  if (schema.type === "boolean") {
    const v = value.toLowerCase();
    const allowed = ["true", "false", "1", "0", "yes", "no"];
    if (!allowed.includes(v)) return "Must be boolean (true/false/yes/no/1/0)";
  }
  if (schema.format === "email") {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(value)) return "Must be a valid email";
  }
  if (schema.minLength !== undefined && value.length < schema.minLength) return `Min length ${schema.minLength}`;
  if (schema.maxLength !== undefined && value.length > schema.maxLength) return `Max length ${schema.maxLength}`;
  if (schema.minimum !== undefined && Number(value) < schema.minimum) return `Min ${schema.minimum}`;
  if (schema.maximum !== undefined && Number(value) > schema.maximum) return `Max ${schema.maximum}`;
  return null;
}

