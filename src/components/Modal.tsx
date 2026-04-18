import {
  Fragment,
  HTMLAttributes,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "motion/react";

const modalVariants = cva(
  "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1000 bg-card text-card-foreground m-auto p-4 rounded flex flex-col gap-2 w-full",
  {
    variants: {
      width: {
        full: "max-w-[90vw]",
        "7xl": "max-w-7xl",
        "5xl": "max-w-5xl",
        "2xl": "max-w-2xl",
        default: "max-w-xl",
        md: "max-w-md",
        sm: "max-w-sm",
        xs: "max-w-xs",
      },
    },
    defaultVariants: {
      width: "default",
    },
  }
);

interface MyModalProps
  extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof modalVariants> {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({
  title,
  isOpen,
  onClose,
  className,
  width,
  children,
}: MyModalProps) {
  useEffect(() => {
    if (isOpen) {
      const bodyChildren = Array.from(document.body.children).filter(
        (child) => !child.hasAttribute("data-modal-content")
      );
      bodyChildren.map((child) => child.setAttribute("inert", ""));
      return () => {
        bodyChildren.map((child) => child.removeAttribute("inert"));
      };
    }
  }, [isOpen]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            id="modal-bg"
            className="fixed inset-0 bg-black/60 z-999"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            data-modal-content
          />
          <motion.div
            id="modal-body"
            className={cn(modalVariants({ width, className }))}
            initial={{ opacity: 0, scale: [0, 0.8] }}
            animate={{ opacity: 1, scale: [1.5, 1] }}
            exit={{ opacity: 0, scale: [0.8, 0] }}
            data-modal-content
          >
            <div className="flex items-center justify-start mb-4 px-2 pt-2">
              <h1 className="flex-1 text-xl mr-4 font-bold">{title}</h1>
              <motion.button
                onClick={onClose}
                className="self-end size-8 p-0.5 text-xl text-card-foreground font-bold"
                whileHover={{
                  scale: 1.1,
                  borderColor: "#BB8303",
                  color: "#BB8303",
                }}
                whileTap={{ scale: 0.9, backgroundColor: "#EBD778" }}
                transition={{ duration: 0.2, ease: "easeIn" }}
              >
                ✕
              </motion.button>
            </div>
            {children}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>,
    document.body
  );
}
