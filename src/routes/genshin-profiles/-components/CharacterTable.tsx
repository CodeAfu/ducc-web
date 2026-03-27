import { useAuth } from "@clerk/tanstack-react-start";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AnimatedButton from "~/components/AnimatedButton";
import { cn } from "~/lib/utils";
import { CharacterListResponse } from "../types";

interface CharacterTableProps extends React.HTMLAttributes<HTMLDivElement> {
  allCharacters: CharacterListResponse[]
}

export default function CharacterTable({ allCharacters, className, ...props }: CharacterTableProps) {
  const [name, setName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  return (
    <div className={cn("w-full overflow-x-auto", className)} {...props}>
      <table className="w-full rounded-md border text-xs text-left table-fixed mb-2">
        <thead className="border-b text-xs">
          <tr>
            <th className="px-1 py-3 font-medium w-[40%]">Char</th>
            <th className="px-1 py-3 border-l font-medium text-center">Lvl</th>
            <th className="px-1 py-3 border-l font-medium text-center">Cons</th>
            <th className="px-1 py-3 border-l font-medium text-center">NA</th>
            <th className="px-1 py-3 border-l font-medium text-center">E</th>
            <th className="px-1 py-3 border-l font-medium text-center">Q</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-1 py-3 border-b border-r truncate">
              Kaedahara Kazuha
            </td>
            <td className="px-1 py-3 text-center border-b">0</td>
            <td className="px-1 py-3 text-center border-b">0</td>
            <td className="px-1 py-3 text-center border-b">0</td>
            <td className="px-1 py-3 text-center border-b">0</td>
            <td className="px-1 py-3 text-center border-b">0</td>
          </tr>
        </tbody>
      </table>
      <div className="w-full text-xs flex items-center gap-2 py-1">
        <input
          ref={inputRef}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => !name && setShowInput(false)}
          className={cn(
            "w-full max-w-48 bg-muted/10 px-0.5 py-1 rounded outline-none transition-opacity duration-200",
            showInput ? "opacity-100" : "w-0 px-0 opacity-0 pointer-events-none"
          )}

        />
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
