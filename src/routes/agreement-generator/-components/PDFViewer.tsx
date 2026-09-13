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
      width={"5xl"}
      isOpen={isOpen}
      onClose={onClose}
      title="A very scuffed preview"
    >
      <iframe
        src={url}
        title="PDF preview"
        className={cn(
          "w-full h-full min-h-[80vh] rounded-md border border-border font-faruma",
          className
        )}
        {...props}
      />
      <div className="text-muted-foreground text-xs">Only open the docx file using msword. Any other app is very likely to break the format of this agreement.</div>
    </Modal>
  );
}
