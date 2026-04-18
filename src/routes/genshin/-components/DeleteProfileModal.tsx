import { useAuth } from "@clerk/tanstack-react-start";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import React from "react";
import toast from "react-hot-toast";
import AnimatedButton from "~/components/AnimatedButton";
import Modal from "~/components/Modal";
import { cn } from "~/lib/utils";

async function deleteProfile(token: string, profileId: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/profiles/${profileId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (res.status !== 204) {
    const msg = await res.text();
    throw new Error(`Expected 204 No Content, received ${res.status}: ${msg}`)
  }
}

export interface DeleteProfileModalProps {
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteProfileModal({ id, isOpen, setIsOpen }: DeleteProfileModalProps) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient();
  const router = useRouter()

  const { mutateAsync: deleteProfileMutation, isPending } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("You are not authorized to use this endpoint");
      await deleteProfile(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "v3", "genshin", "profiles"] })
      router.navigate({ to: "/genshin" })
    },
    onError: (err) => {
      console.error(err)
    }
  })

  const handleDeleteProfile = () => {
    toast.promise(deleteProfileMutation(), {
      loading: "Deleting profile...",
      success: "Profile deleted successfully",
      error: (err) => err.message,
    })
    setIsOpen(false)
  }

  return (
    <Modal
      width="md"
      title="Delete Profile Confirmation"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className={cn("")}
    >
      <div className="flex flex-col gap-8 px-2">
        <p>
          You are about to delete this profile. Are you sure?
        </p>
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
            onClick={handleDeleteProfile}
            variant="destructive"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AnimatedButton>
        </div>
      </div>
    </Modal>
  )
}
