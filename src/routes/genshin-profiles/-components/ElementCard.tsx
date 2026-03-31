import { useAuth } from "@clerk/tanstack-react-start";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react"
import { cn } from "~/lib/utils"

interface ElementCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  element?: string; // calls the API with this
  bgColorClass?: string;
}

export default function ElementCard({ title, element, bgColorClass, children, className, ...props }: ElementCardProps) {
  const { getToken } = useAuth()
  const { data: iconUrl } = useSuspenseQuery({
    queryKey: ["api", "v3", "genshin", "elements", element, "icon"],
    queryFn: async () => {
      if (!element) return null;
      const token = await getToken();
      if (!token) throw new Error("token is null");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/elements/${element}/icon`);
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    },
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 14,
  })

  return (
    <div
      className={cn(
        "border-2 border-muted-foregound rounded-md bg-card",
        "p-4",
        bgColorClass,
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 mb-4">
        {element && iconUrl && (
          <img src={iconUrl} alt={element} className="size-8" />
        )}
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      {children}
    </div>
  )
}
