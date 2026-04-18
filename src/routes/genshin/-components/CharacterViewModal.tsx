import { useQuery } from "@tanstack/react-query";
import Modal from "~/components/Modal";
import { cn } from "~/lib/utils";
import { CharacterListResponse } from "../types";
import { useAuth } from "@clerk/tanstack-react-start";
import CharacterIcon from "./CharacterIcon";


interface CharacterViewModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CharacterViewModal({ isOpen, setIsOpen }: CharacterViewModalProps) {
  const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { data: charactersList } = useQuery({
    queryKey: ["api", "v3", "genshin", "characters"],
    queryFn: async (): Promise<CharacterListResponse[]> => {
      const token = await getToken();
      if (!token) throw new Error("You are not authorized to use this endpoint")
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/characters`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    },
    enabled: isAuthLoaded && isSignedIn
  })
  return (
    <Modal
      title="Genshin Character List"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className={cn("h-[90vh] overflow-y-scroll sm:px-8 px-4")}
      width="full"
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-4 place-items-center">
        {charactersList?.map(character => (
          <CharacterIcon character={character} />
        ))}
      </div>
    </Modal>
  );
}
