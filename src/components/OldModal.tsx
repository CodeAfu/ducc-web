// components/ui/Modal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface ModalProps {
  title?: string;
  titleSize?: "sm" | "md" | "lg";
  description?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function OldModal({
  title,
  titleSize = "md",
  description,
  isOpen,
  onOpenChange,
  children,
  size = "md",
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40" />
        <Dialog.Content
          className={cn(
            "fixed z-50 bg-zinc-900 p-6 rounded-2xl shadow-xl transition-all duration-300",
            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            {
              "w-full max-w-sm": size === "sm",
              "w-full max-w-lg": size === "md",
              "w-full max-w-2xl": size === "lg",
            }
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {title && (
                <Dialog.Title
                  className={cn("text-lg font-bold text-white", {
                    "text-sm": titleSize === "sm",
                    "text-base": titleSize === "md",
                    "text-lg": titleSize === "lg",
                  })}
                >
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="text-sm text-zinc-400">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <button
                className="p-2 rounded-md hover:bg-zinc-800 text-zinc-300 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
