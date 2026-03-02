import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import Modal from "~/components/Modal";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="p-2 h-400">
        <h1 className="text-lg font-bold">Ducc</h1>
        <div>
          <Button onClick={() => setIsOpen(true)}>Test Modal</Button>
        </div>
      </div>
      <Modal isOpen={isOpen} title="Title" onOpenChange={setIsOpen}>
        Test
      </Modal>
    </>
  );
}
