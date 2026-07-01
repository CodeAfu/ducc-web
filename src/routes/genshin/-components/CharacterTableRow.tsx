import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import ElementCardInput from "./ElementCardInput";
import { Ellipsis } from "lucide-react";
import { ProfileCharacterResponse, ProfileResponse } from "../-types";
import { useAuth } from "@clerk/tanstack-react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "~/hooks/useDebounce";
import ConfirmationModal from "~/components/ConfirmationModal";
import DropdownMenu, { DropdownItem } from "~/components/DropdownMenu";

interface CharacterTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  profileId: string;
  character: ProfileCharacterResponse;
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
    mutationFn: async (updatedChar: ProfileCharacterResponse) => {
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
          talent_na_boosted: updatedChar.talent_na_boosted,
          talent_e_boosted: updatedChar.talent_e_boosted,
          talent_q_boosted: updatedChar.talent_q_boosted,
          notes: updatedChar.char_notes,
        })
      })
      if (!res.ok) {
        throw new Error(`Update failed for character '${updatedChar.name}': ${await res.text()}`)
      }
    },
    onMutate: async (updatedChar) => {
      await queryClient.cancelQueries({ queryKey: ["api", "v3", "genshin", "profiles", profileId, "characters"] });
      const previousProfile = queryClient.getQueryData<ProfileResponse>(["api", "v3", "genshin", "profiles", profileId, "characters"]);

      if (previousProfile?.characters) {
        queryClient.setQueryData<ProfileResponse>(
          ["api", "v3", "genshin", "profiles", profileId, "characters"],
          (old) => {
            if (!old?.characters) return old;
            return {
              ...old,
              characters: old.characters.map((c) => (c.char_id === updatedChar.char_id ? updatedChar : c))
            };
          }
        );
      }

      return { previousProfile };
    },
    onError: (err, _, context) => {
      console.error(err.message);
      if (context?.previousProfile) {
        queryClient.setQueryData(
          ["api", "v3", "genshin", "profiles", profileId, "characters"],
          context.previousProfile
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "v3", "genshin", "profiles", profileId, "characters"] });
    },
  })
  const debouncedUpdate = useDebouncedCallback((updatedData: ProfileCharacterResponse) => {
    toast.promise(updateCharacterMutation(updatedData), {
      loading: `Saving ${updatedData.name}...`,
      success: `Saved ${updatedData.name}`,
      error: (err) => `Error updating char '${updatedData.name}': ${err.message}`,
    });
  }, 2000);

  const debouncedUpdateFast = useDebouncedCallback((updatedData: ProfileCharacterResponse) => {
    toast.promise(updateCharacterMutation(updatedData), {
      loading: `Saving ${updatedData.name}...`,
      success: `Saved ${updatedData.name}`,
      error: (err) => err.message,
    });
  }, 100);

  const handleFieldChange = (field: keyof ProfileCharacterResponse, value: number) => {
    const newState = { ...charState, [field]: value };
    setCharState(newState);
    debouncedUpdate(newState);
  };

  const handleBoostToggle = (field: "talent_na_boosted" | "talent_e_boosted" | "talent_q_boosted") => {
    const newState = { ...charState, [field]: !charState[field] };
    setCharState(newState);
    debouncedUpdateFast(newState);
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
            defaultValue={charState.level}
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
              defaultValue={charState.asc_level}
              onValueChange={(val) => handleFieldChange("asc_level", val)}
              min={1}
              max={100}
            />
          </div>
        </td>
        <td className="px-1.5 py-2 text-center border-b">
          <ElementCardInput
            options={[0, 1, 2, 3, 4, 5, 6]}
            defaultValue={charState.constellation}
            onValueChange={(val) => handleFieldChange("constellation", val)}
            min={0}
            max={6}
          />
        </td>
        <td className="px-1.5 py-2 text-center border-b">
          <ElementCardInput
            className={cn("text-primary", charState.talent_na_boosted && "text-cyan-400")}
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse()}
            defaultValue={charState.talent_na_boosted ? charState.talent_na + 3 : charState.talent_na}
            onValueChange={(val) => handleFieldChange("talent_na", val)}
            min={1}
            max={15}
          />
        </td>
        <td className="px-1.5 py-2 text-center border-b">
          <ElementCardInput
            className={cn("text-primary", charState.talent_e_boosted && "text-cyan-400")}
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse()}
            defaultValue={charState.talent_e_boosted ? charState.talent_e + 3 : charState.talent_e}
            onValueChange={(val) => handleFieldChange("talent_e", val)}
            min={1}
            max={15}
          />
        </td>
        <td className="px-1.5 py-2 text-center border-b">
          <ElementCardInput
            className={cn("text-primary", charState.talent_q_boosted && "text-cyan-400")}
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse()}
            defaultValue={charState.talent_q_boosted ? charState.talent_q + 3 : charState.talent_q}
            onValueChange={(val) => handleFieldChange("talent_q", val)}
            min={1}
            max={15}
          />
        </td>
        <td className="px-1.5 py-2 text-center align-middle border-b">
          <DropdownMenu className="text-xs min-w-16"
            align="right"
            trigger={
              <div className="flex items-center justify-center size-6">
                <Ellipsis className="size-4" />
              </div>
            }>
            <DropdownItem
              className="px-2 py-1 text-xs"
              onClick={() => handleBoostToggle("talent_na_boosted")}
            >
              {charState.talent_na_boosted ? "−3 NA" : "+3 NA"}
            </DropdownItem>
            <DropdownItem
              className="px-2 py-1 text-xs"
              onClick={() => handleBoostToggle("talent_e_boosted")}
            >
              {charState.talent_e_boosted ? "−3 E" : "+3 E"}
            </DropdownItem>
            <DropdownItem
              className="px-2 py-1 text-xs"
              onClick={() => handleBoostToggle("talent_q_boosted")}
            >
              {charState.talent_q_boosted ? "−3 Q" : "+3 Q"}
            </DropdownItem>
            <DropdownItem
              className="px-2 py-1 text-destructive text-xs"
              onClick={() => setIsConfirmDeleteModalOpen(true)}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </td>
      </tr>
      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        mutationFn={deleteCharacter}
        variables={character.char_id}
        invalidateQueryKeys={["api", "v3", "genshin", "profiles", profileId]}
        title={"Confirm Delete"}
        description={<>You are about to delete <span className="text-primary font-semibold">{character.name}</span>. Are you sure?</>}
        loadingMessage="Deleting..."
        successMessage={`${character.name} deleted successfully`}
      />
    </React.Fragment>
  );
}
