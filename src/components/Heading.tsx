import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "~/lib/utils";

const headingVariants = cva("font-bold", {
  variants: {
    size: {
      sm: "text-lg",
      base: "text-2xl",
      lg: "text-4xl",
      xl: "text-6xl",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean;
}

export default function Heading({
  size,
  asChild,
  className,
  children,
  ...props
}: HeadingProps) {
  const Comp = asChild ? Slot : "h1";

  return (
    <Comp
      data-slot="h1"
      className={cn(headingVariants({ size, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
}
