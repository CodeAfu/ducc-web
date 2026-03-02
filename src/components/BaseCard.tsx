import React from "react";
import { cn } from "~/lib/utils";

interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function BaseCard({
  children,
  className,
  ...props
}: BaseCardProps) {
  return (
    <div className={cn("bg-gray-400/20 py-4 px-6 rounded-lg", className)} {...props}>
      {children}
    </div>
  );
}
