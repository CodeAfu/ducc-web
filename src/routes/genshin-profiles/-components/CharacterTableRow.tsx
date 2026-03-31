import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import ElementCardInput from "./ElementCardInput";
import { Trash2 } from "lucide-react";
import { CharacterResponse } from "../types";
import { useAuth } from "@clerk/tanstack-react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "~/hooks/useDebounce";
import ConfirmationModal from "~/components/ConfirmationModal";

interface CharacterTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  profileId: string;
  character: CharacterResponse;
}

export default function CharacterTableRow({ profileId, character, className, ...props }: CharacterTableRowProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [charState, setCharState] = useState(character);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  useEffect(() => {
    setCharState(character);
  }, [character]);

  const deleteCharacter = async (charId: number) => {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/profiles/${profileId}/${charId.toString()}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    if (res.status !== 204) {
      throw new Error(`Expected 204 No Content, received ${res.status}: ${await res.text()}`)
    }
  }

  const { mutateAsync: updateCharacterMutation } = useMutation({
    mutationFn: async (updatedChar: CharacterResponse) => {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/profiles/${profileId}/${updatedChar.char_id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          prof_id: Number(profileId),
          char_id: updatedChar.char_id,
          level: updatedChar.level,
          asc_level: updatedChar.asc_level,
          constellation: updatedChar.constellation,
          talent_na: updatedChar.talent_na,
          talent_e: updatedChar.talent_e,
          talent_q: updatedChar.talent_q,
          notes: updatedChar.char_notes,
        })
      })
      if (!res.ok) {
        throw new Error(`Update failed for character '${updatedChar.name}': ${await res.text()}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "v3", "genshin", "profiles", profileId, "characters"] });
    },
    onError: (err) => {
      console.error(err.message);
    }
  })
  const debouncedUpdate = useDebouncedCallback((updatedData: CharacterResponse) => {
    toast.promise(updateCharacterMutation(updatedData), {
      loading: `Saving ${updatedData.name}...`,
      success: "Saved",
      error: (err) => err.message,
    });
  }, 2000);

  const handleFieldChange = (field: keyof CharacterResponse, value: number) => {
    const newState = { ...charState, [field]: value };
    setCharState(newState);
    debouncedUpdate(newState);
  };

  return (
    <React.Fragment>
      <tr className={cn(
        character.stars === 5 && "bg-gold/30",
        character.stars === 4 && "bg-purple/30",
      )}
        {...props}
      >

        <td className="px-1.5 py-2 border-b border-r truncate">
          {character.display_name ? character.display_name : character.name}
        </td>
        <td className="px-1.5 py-2 text-center border-b">
          <ElementCardInput
            options={[1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].reverse()}
            defaultValue={character.level}
            onValueChange={(val) => handleFieldChange("level", val)}
            min={1}
            max={100}
          />
          <br />
          <div className="inline-flex ">
            <span className="text-foreground/50">/</span>
            <ElementCardInput
              className="text-foreground/50"
              options={[20, 30, 40, 50, 60, 70, 80, 90, 100].reverse()}
              defaultValue={character.asc_level}
              onValueChange={(val) => handleFieldChange("asc_level", val)}
              min={20}
              max={100}
            />
          </div>
        </td>
        <td className="px-1.5 py-2 text-center border-b">
          <ElementCardInput
            options={[0, 1, 2, 3, 4, 5, 6]}
            defaultValue={character.constellation}
            onValueChange={(val) => handleFieldChange("constellation", val)}
            min={0}
            max={6}
          />
        </td>
        <td className="px-1.5 py-2 text-center border-b">
          <ElementCardInput
            className="text-primary"
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse()}
            defaultValue={character.talent_na}
            onValueChange={(val) => handleFieldChange("talent_na", val)}
            min={1}
            max={15}
          />
        </td>
        <td className="px-1.5 py-2 text-center border-b">
          <ElementCardInput
            className="text-primary"
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse()}
            defaultValue={character.talent_e}
            onValueChange={(val) => handleFieldChange("talent_e", val)}
            min={1}
            max={15}
          />
        </td>
        <td className="px-1.5 py-2 text-center border-b">
          <ElementCardInput
            className="text-primary"
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse()}
            defaultValue={character.talent_q}
            onValueChange={(val) => handleFieldChange("talent_q", val)}
            min={1}
            max={15}
          />
        </td>
        <td className="px-1.5 py-2 text-center align-middle border-b">
          <button
            onClick={() => setIsConfirmDeleteModalOpen(true)}
            className="block mx-auto hover:text-destructive active:ring-destructive hover:cursor-pointer active:scale-102 transition duration-200"
          >
            <Trash2 className="size-4" />
          </button>
        </td>
      </tr>
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        mutationFn={deleteCharacter}
        variables={character.char_id}
        invalidateQueryKeys={["api", "v3", "genshin", "profiles", profileId]}
        title={"Confirm Delete"}
        description={`You are about to delete character '${character.name}'. Are you sure?`}
        loadingMessage="Deleting..."
        successMessage={`${character.name} deleted successfully`}
      />
    </React.Fragment>
  );
}
