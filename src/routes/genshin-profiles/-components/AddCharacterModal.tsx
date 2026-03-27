import { useAuth } from "@clerk/tanstack-react-start";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import AnimatedButton from "~/components/AnimatedButton";
import Modal from "~/components/Modal";
import { cn } from "~/lib/utils";

const genshinCharacterSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  element_name: z.enum(["pyro", "hydro", "anemo", "electro", "dendro", "cryo", "geo"], {
    errorMap: () => ({ message: "Invalid or missing element" }),
  }),
  stars: z.number().int().min(4, "Must be at least 4").max(5, "Must be at most 5"),
  icon: z.string().optional(),
  notes: z.string().max(500, "Notes are too long").optional(),
});

type CreateGenshinCharacterValues = z.infer<typeof genshinCharacterSchema>;

async function addCharacter(token: string, createCharacterPayload: CreateGenshinCharacterValues) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/characters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(createCharacterPayload)
  });
  if (!res.ok) {
    throw new Error(await res.text())
  }
  const json = await res.json();
  return json;
}

export interface AddCharacterModalProps {
  characters: string[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddCharacterModal({ characters, isOpen, setIsOpen }: AddCharacterModalProps) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateGenshinCharacterValues>({
    resolver: zodResolver(genshinCharacterSchema),
    defaultValues: {
      stars: 4,
    }
  });

  const { mutateAsync: addCharacterMutation, isPending } = useMutation({
    mutationFn: async (payload: CreateGenshinCharacterValues) => {
      const token = await getToken();
      if (!token) throw new Error("You are not authorized to use this endpoint");
      await addCharacter(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "v3", "genshin", "characters"] })
      reset();
    },
    onError: (err) => {
      console.error(err)
    }
  })

  const handleAddCharacter = (data: CreateGenshinCharacterValues) => {
    toast.promise(addCharacterMutation(data), {
      loading: "Creating character...",
      success: `Character created: ${data.name}`,
      error: (err) => err.message,
    })
    setIsOpen(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setValue("icon", undefined, { shouldValidate: true });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("icon", reader.result as string, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      title="Create Character"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className={cn("")}
    >
      <form
        onSubmit={handleSubmit(handleAddCharacter)}
        className="flex flex-col gap-8 px-2"
      >
        <div className="border p-4 rounded grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
          <label className="text-sm mt-2">Name: <span className="text-destructive">*</span></label>
          <div className="flex flex-col gap-1">
            <input
              {...register("name")}
              className="border-2 rounded outline-none px-2 py-1 w-full"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>

          <label className="text-sm mt-2">Element: <span className="text-destructive">*</span></label>
          <div className="flex flex-col gap-1">
            <select
              {...register("element_name")}
              className="border-2 rounded outline-none px-2 py-1 bg-transparent w-full"
            >
              <option value="" className="bg-popover">Select Element</option>
              <option value="pyro" className="bg-popover">Pyro</option>
              <option value="hydro" className="bg-popover">Hydro</option>
              <option value="anemo" className="bg-popover">Anemo</option>
              <option value="electro" className="bg-popover">Electro</option>
              <option value="dendro" className="bg-popover">Dendro</option>
              <option value="cryo" className="bg-popover">Cryo</option>
              <option value="geo" className="bg-popover">Geo</option>
            </select>
            {errors.element_name && <span className="text-red-500 text-xs">{errors.element_name.message}</span>}
          </div>

          <label className="text-sm mt-2">Stars: <span className="text-destructive">*</span></label>
          <div className="flex flex-col gap-1">
            <select
              {...register("stars", { valueAsNumber: true })}
              className="border-2 rounded outline-none px-2 py-1 w-full bg-transparent"
            >
              <option value="4" className="bg-popover">4 Stars</option>
              <option value="5" className="bg-popover">5 Stars</option>
            </select>
            {errors.stars && <span className="text-red-500 text-xs">{errors.stars.message}</span>}
          </div>

          <label className="text-sm mt-2">Icon:</label>
          <div className="flex flex-col gap-1 w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border-2 rounded outline-none px-2 py-1 w-full cursor-pointer file:cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-accent file:text-accent-foreground"
            />
            <input type="hidden" {...register("icon")} />
            {errors.icon && <span className="text-red-500 text-xs">{errors.icon.message}</span>}
          </div>

          <label className="text-sm mt-2">Notes:</label>
          <div className="flex flex-col gap-1">
            <textarea
              {...register("notes")}
              rows={3}
              className="border-2 rounded outline-none px-2 py-1 resize-none w-full"
            />
            {errors.notes && <span className="text-red-500 text-xs">{errors.notes.message}</span>}
          </div>
        </div>
        <div className="flex items-end justify-end gap-2">
          <AnimatedButton
            type="button"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Cancel
          </AnimatedButton>
          <AnimatedButton
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Create Character"}
          </AnimatedButton>
        </div>
      </form>
    </Modal>
  )
}
