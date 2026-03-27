import { cn } from "~/lib/utils";

export default function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted h-full w-full min-h-12", className)}
      {...props}
    />
  );
}
