import { useAuth } from "@clerk/tanstack-react-start";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import AnimatedButton from "~/components/AnimatedButton";
import Modal from "~/components/Modal";
import { cn } from "~/lib/utils";

async function addNotes(token: string, profileId: string, notes?: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/profiles/${profileId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      notes: notes
    })
  });
  if (!res.ok) {
    throw new Error(await res.text())
  }
  const json = await res.json();
  return json;
}

export interface AddNotesModalProps {
  id: string;
  notes: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddNotesModal({ id, notes, isOpen, setIsOpen }: AddNotesModalProps) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient();
  const notesRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutateAsync: addNoteMutation, isPending } = useMutation({
    mutationFn: async ({ notesPayload }: { notesPayload?: string }) => {
      const token = await getToken();
      if (!token) throw new Error("You are not authorized to use this endpoint");
      await addNotes(token, id, notesPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "v3", "genshin", "profiles"] })
    },
    onError: (err) => {
      console.error(err)
    }
  })

  const handleAddNotes = () => {
    const notesPayload = notesRef.current?.value;
    toast.promise(addNoteMutation({ notesPayload }), {
      loading: "Adding note...",
      success: "Note added",
      error: (err) => err.message,
    })
    setIsOpen(false)
  }

  return (
    <Modal
      width="md"
      title="Add Note"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className={cn("")}
    >
      <div className="flex flex-col gap-8 px-2">
        <textarea
          ref={notesRef}
          defaultValue={notes}
          rows={4}
          className="border text-sm p-2 outline-none resize-none"
        />

        <div className="flex items-end justify-end gap-2">
          <AnimatedButton
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Cancel
          </AnimatedButton>
          <AnimatedButton
            disabled={isPending}
            onClick={() => handleAddNotes()}
          >
            {isPending ? "Saving..." : "Add Note"}
          </AnimatedButton>
        </div>
      </div>
    </Modal>
  )
}
