import React from "react";
import { cn } from "~/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div className={cn("sm:px-4 px-2 mt-4 flex flex-col max-w-7xl mx-auto w-full", className)} {...props}>
      {children}
    </div>
  );
}
