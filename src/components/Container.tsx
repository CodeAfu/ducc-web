import React from "react";
import { cn } from "~/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div className={cn("md:max-w-7xl mx-auto w-full px-4", className)} {...props}>
      {children}
    </div>
  );
}
