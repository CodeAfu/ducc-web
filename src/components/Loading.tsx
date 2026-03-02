import { cn } from "~/lib/utils";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Loading({
  size = "md",
  className,
  ...props
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-6"
  };

  return (
    <div
      {...props}
      className={cn("flex items-center justify-center", className)}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-gray-600 border-t-primary",
          sizeClasses[size]
        )}
      />
    </div>
  );
}
