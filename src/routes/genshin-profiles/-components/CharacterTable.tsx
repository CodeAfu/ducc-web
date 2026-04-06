import { Plus, Settings } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedButton from "~/components/AnimatedButton";
import { cn } from "~/lib/utils";
import { CharacterListResponse, CharacterResponse } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/tanstack-react-start";
import CharacterTableRow from "./CharacterTableRow";

interface CharacterTableProps extends React.HTMLAttributes<HTMLDivElement> {
  profileId: string;
  allCharacters: CharacterListResponse[]
  profileCharacters: CharacterResponse[]
  element?: string;
  isTraveler?: boolean;
}

export default function CharacterTable({ profileId, allCharacters, profileCharacters, element, isTraveler, className, ...props }: CharacterTableProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient()
  const [name, setName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredSuggestions = useMemo(() => {
    if (!name.trim()) return [];
    return allCharacters.filter(c =>
      isTraveler
        ? c.name.includes("Traveler") && c.name.toLowerCase().includes(name.toLowerCase())
        : c.element_name === element && !c.name.includes("Traveler") && c.name.toLowerCase().includes(name.toLowerCase())
    );
  }, [allCharacters, element, name, isTraveler]);

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  const { mutateAsync: addCharacterMutation } = useMutation({
    mutationFn: async (charName: string) => {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized")
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/profiles/${profileId}/${encodeURIComponent(charName)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          level: 1,
          constellation: 0,
          talent_na: 1,
          talent_e: 1,
          talent_q: 1,
          talent_na_boosted: false,
          talent_e_boosted: false,
          talent_q_boosted: false,
          notes: "",
        })
      })
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "v3", "genshin", "profiles", profileId] });
    },
    onError: (err) => {
      console.error(err.message);
    }
  })

  const handleSelect = (charName: string) => {
    setName(charName);
    setShowSuggestions(false);
  };

  const handleAddCharacter = (overrideName?: string) => {
    const targetName = overrideName ?? name;

    const match = allCharacters
      .filter(c => isTraveler ? c.name.includes("Traveler") : c.element_name === element)
      .find((c) => c.name.toLowerCase() === targetName.trim().toLowerCase());

    if (match) {
      toast.promise(addCharacterMutation(targetName), {
        loading: "Adding character...",
        success: "Character added",
        error: (err) => err.message,
      });
      setName("");
      setShowInput(false);
      setShowSuggestions(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <table className="w-full rounded-md border text-xs text-left table-fixed mb-2">
        <thead className="border-b text-xs">
          <tr>
            <th className="px-1.5 py-2 font-medium w-[35%]">Char</th>
            <th className="px-1.5 py-2 border-l font-medium text-center">Lvl</th>
            <th className="px-1.5 py-2 border-l font-medium text-center">Cons</th>
            <th className="px-1.5 py-2 border-l font-medium text-center">NA</th>
            <th className="px-1.5 py-2 border-l font-medium text-center">E</th>
            <th className="px-1.5 py-2 border-l font-medium text-center">Q</th>
            <th className="px-1.5 py-2 border-l font-medium flex flex-col items-center justify-center text-center">
              <Settings className="size-4" />
            </th>
          </tr>
        </thead>
        <tbody>
          {profileCharacters
            .filter(c => isTraveler
              ? c.name.includes("Traveler")
              : c.element_name === element && !c.name.includes("Traveler")
            )
            .sort((a, b) => {
              const starDiff = Number(b.stars) - Number(a.stars);
              if (starDiff !== 0) return starDiff;
              const nameA = (a.display_name ? a.display_name : a.name).toLowerCase();
              const nameB = (b.display_name ? b.display_name : b.name).toLowerCase();
              return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
            })
            .map(c => (
              <CharacterTableRow key={c.char_id} profileId={profileId} character={c} />
            ))}
        </tbody>
      </table>
      <div className="relative w-full text-xs flex items-center gap-2 py-1">
        <div className={cn(
          "relative w-full max-w-48 text-xs flex items-center gap-2 py-1",
          showInput ? "opacity-100" : "w-0 px-0 opacity-0 pointer-events-none"
        )}>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (filteredSuggestions.length === 1) {
                  handleAddCharacter(filteredSuggestions[0].name);
                  return;
                }
                handleAddCharacter()
              }
            }}
            onBlur={(e) => {
              if (!e.currentTarget?.value) {
                setShowInput(false);
              }
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="Search..."
            className={cn(
              "bg-muted/10 px-0.5 py-1 rounded outline-none focus:ring-primary/50 transition duration-200",
              showInput ? "opacity-100" : "w-0 px-0 opacity-0 pointer-events-none"
            )}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full mb-1 w-full bg-background border rounded-md shadow-lg max-h-40 overflow-y-auto z-50">
              {filteredSuggestions.map((char) => (
                <button
                  key={char.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelect(char.name);
                    handleAddCharacter(char.name);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-muted transition-colors border-b last:border-0"
                >
                  {char.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <AnimatedButton
          onClick={() => setShowInput(true)}
          className="size-6 p-0 rounded-sm bg-transparent border-2 border-muted-foreground group hover:bg-transparent hover:border-primary transition duration-200"
        >
          <Plus className="text-primary-foreground group-hover:text-primary" />
        </AnimatedButton>
      </div>
    </div>
  );
}
