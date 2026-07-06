import { HTMLAttributes } from "react";
import Modal from "~/components/Modal";
import { cn } from "~/lib/utils";

interface ModalPDFViewerProps extends HTMLAttributes<HTMLIFrameElement> {
  url: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ModalPDFViewer({ url, isOpen, onClose, className, ...props }: ModalPDFViewerProps) {
  if (!url) return null;
  return (
    <Modal
      width={"7xl"}
      isOpen={isOpen}
      onClose={onClose}
      title="This preview looks broken, I know."
    >
      <iframe
        src={url}
        title="PDF preview"
        className={cn(
          "w-full min-h-[80vh] rounded-md border border-border",
          className
        )}
        {...props}
      />
    </Modal>
  );
}
