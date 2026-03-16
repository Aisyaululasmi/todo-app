import * as React from "react";
import clsx from "clsx";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const base = clsx(
    "inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none",
    sizeClasses[size],
    className
  );

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx(base, "object-cover")}
      />
    );
  }

  return (
    <span className={clsx(base, "bg-indigo-100 text-indigo-700 font-medium")}>
      {getInitials(name)}
    </span>
  );
}

export { Avatar, getInitials };
export type { AvatarProps, AvatarSize };
