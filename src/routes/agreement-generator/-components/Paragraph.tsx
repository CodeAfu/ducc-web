import { cn } from "~/lib/utils";

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> { }

export function Paragraph({ children, className, ...props }: ParagraphProps) {
  return (
    <p className={cn("group relative", className)} {...props}>
      <div className="absolute pointer-events-none scale-x-105 scale-y-l05 overflow-hidden inset-0 group-focus-within:bg-gray-200/10 transition duration-100" />
      {children}
    </p>
  )
}
