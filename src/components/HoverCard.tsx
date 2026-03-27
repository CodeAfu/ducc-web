import { cn } from "~/lib/utils";

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function HoverCard({ content, className, children, ...props }: HoverCardProps) {
  return (
    <div className="relative inline-block group">
      <div
        tabIndex={0}
        className={cn(
          "border-2 border-secondary bg-accent outline-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}
