import * as React from "react";
import clsx from "clsx";

interface CardSectionProps {
  className?: string;
  children?: React.ReactNode;
}

function Card({ className, children }: CardSectionProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        "dark:border-slate-700 dark:bg-slate-800",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children }: CardSectionProps) {
  return (
    <div
      className={clsx(
        "border-b border-slate-200 px-6 py-4",
        "dark:border-slate-700",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardBody({ className, children }: CardSectionProps) {
  return (
    <div className={clsx("px-6 py-4", className)}>
      {children}
    </div>
  );
}

function CardFooter({ className, children }: CardSectionProps) {
  return (
    <div
      className={clsx(
        "border-t border-slate-200 px-6 py-4",
        "dark:border-slate-700",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardBody, CardFooter };
export type { CardSectionProps };
