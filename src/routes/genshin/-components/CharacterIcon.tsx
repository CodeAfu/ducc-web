import { Link } from "@tanstack/react-router";
import { CharacterListResponse } from "../types";
import { cn } from "~/lib/utils";

interface CharacterIconProps extends React.HTMLAttributes<HTMLAnchorElement> {
  character: CharacterListResponse
}

export default function CharacterIcon({ character, className, ...props }: CharacterIconProps) {
  return (
    <Link
      to="/genshin/characters/$id"
      params={{ id: character.id.toString() }}
      {...props}
      className={cn(
        "flex flex-col border rounded shadow w-full max-w-28 h-36 group ring-primary hover:ring-1 active:ring-1 active:ring-primary transition duration-200",
        className
      )}
    >
      <div className="border-b flex flex-col items-center justify-center">
        <span className="text-7xl font-bold h-28 flex items-center justify-center">
          ?
        </span>
      </div>
      <div className="text-xs truncate h-full flex flex-col justify-center px-1 group-hover:bg-primary/50 group-active:bg-primary/50 transition duration-200">
        {character.name}
      </div>
    </Link>
  );
}
