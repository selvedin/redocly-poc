import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "xs" | "sm" | "md";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--foreground)] text-white shadow hover:brightness-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
  outline:
    "border border-[color:var(--border)] text-[color:var(--foreground)] hover:bg-[color:var(--muted)] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
  ghost: "text-[color:var(--foreground)] hover:bg-[color:var(--muted)] dark:text-slate-200 dark:hover:bg-slate-800",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-[11px]",
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "outline", size = "sm", label, children, className, type = "button", ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx("rounded font-semibold transition", variantClasses[variant], sizeClasses[size], className)}
        {...rest}
      >
        {label ?? children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

