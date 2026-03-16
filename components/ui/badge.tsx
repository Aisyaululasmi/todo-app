import * as React from "react";
import clsx from "clsx";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  primary: "bg-indigo-100 text-indigo-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger:  "bg-red-100 text-red-700",
};

function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
