import { cn } from "~/lib/utils";

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> { }

export function Paragraph({ children, className, ...props }: ParagraphProps) {
  return (
    <p className={cn("group relative", className)} {...props}>
      <div className="absolute pointer-events-none scale-x-105 inset-0 group-hover:bg-white/10 transition duration-100" />
      {children}
    </p>
  )
}
