import { useAuth } from "@clerk/tanstack-react-start";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import AnimatedButton from "~/components/AnimatedButton";
import Modal from "~/components/Modal";
import { cn } from "~/lib/utils";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  notes: z.string().max(500, "Notes are too long").optional(),
});

type SaveProfileFormValues = z.infer<typeof profileSchema>;

interface CreateProfileModalProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateProfileModal({ title, isOpen, setIsOpen }: CreateProfileModalProps) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaveProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      notes: "",
    },
  });

  const { mutateAsync: addProfileAsync, isPending, isError, error } = useMutation({
    mutationFn: async (data: SaveProfileFormValues) => {
      const token = await getToken();
      if (!token) throw new Error("You are not authorized to use this action")
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error(await res.text());
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "v3", "genshin", "profiles"] });
      handleClose();
    }
  })

  const onSubmit = async (data: SaveProfileFormValues) => {
    await toast.promise(addProfileAsync(data), {
      loading: "Saving profile...",
      success: "Profile saved successfully!",
      error: (err) => err.message || "Failed to save profile",
    });
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <Modal
      title="Create Profile"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className={cn("")}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <div className="rounded px-2 pb-6 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4">
          <label
            className="text-sm"
          >
            Name: <span className="text-destructive font-bold">*</span>
          </label>
          <input
            {...register("name")}
            className="border-2 rounded outline-none px-2 py-1"
          />

          <label
            className="text-sm self-start"
          >
            Notes:
          </label>
          <textarea
            {...register("notes")}
            disabled={isPending}
            rows={3}
            placeholder="Optional field"
            className="border-2 rounded outline-none px-2 py-1 resize-none"
          />
        </div>
        <div className="flex items-end justify-end gap-2">
          <AnimatedButton
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </AnimatedButton>
          <AnimatedButton
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </AnimatedButton>
        </div>
      </form>
    </Modal>
  )
}
