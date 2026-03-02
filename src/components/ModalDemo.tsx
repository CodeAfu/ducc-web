import { useState } from "react";
import OldModal from "~/components/OldModal";
import { Button } from "~/components/ui/button";

export default function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <OldModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Confirm Action"
        description="This action cannot be undone."
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            Are you sure you want to proceed?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // do something
                setIsOpen(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </OldModal>
    </>
  );
}
