import { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export default function RedditCard({
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn("rounded p-2 min-h-[70dvh]", className)}
      {...props}
    >
      {children}
    </div>
  );
}
