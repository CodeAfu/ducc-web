import { cva, VariantProps } from "class-variance-authority";
import { motion, Variants } from "motion/react";
import { HTMLAttributes, RefObject } from "react";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "relative px-4 py-2 inline-flex items-center overflow-hidden justify-center whitespace-nowrap rounded-lg text-sm font-medium disabled:pointer-events-none disabled:opacity-50 transition-colors duration-150 focus:outline-none",
  {
    variants: {
      size: {
        xl: "px-8 py-4 text-lg",
        lg: "px-6 py-3 text-base",
        base: "px-4 py-2 text-sm",
        md: "px-3 py-1.5 text-sm",
        sm: "px-2 py-1 text-xs",
        xs: "px-1.5 py-0.5 text-xs",
      },
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-border hover:bg-input/30",
      },
    },
    defaultVariants: {
      size: "base",
      variant: "primary",
    },
  }
);

interface AnimatedButtonProps
  extends HTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  ref?: RefObject<HTMLButtonElement | null>;
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  size,
  variant,
  ref,
  type,
  disabled = false,
  onClick,
  className,
}: AnimatedButtonProps) {
  const variants: Variants = {
    onHover: {
      scale: 1.05,
      transition: {
        type: "spring",
        duration: 0.2,
      },
    },
    onTap: {
      scale: 0.95,
      transition: {
        type: "spring",
        duration: 0.2,
      },
    },
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      className={cn(buttonVariants({ className, size, variant }))}
      type={type}
      disabled={disabled}
      variants={variants}
      whileHover="onHover"
      whileTap="onTap"
    >
      {children}
    </motion.button>
  );
}
