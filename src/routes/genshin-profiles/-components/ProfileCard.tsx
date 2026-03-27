
import { Link } from "@tanstack/react-router"
import React from "react"
import { cn } from "~/lib/utils"

interface ProfileCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  profileId: number
}

export default function ProfileCard({ profileId, children, className, ...props }: ProfileCardProps) {
  return (
    <Link
      className={cn(
        "block border-2 border-muted-foregound rounded-md bg-card hover:bg-popover active:bg-popover hover:scale-102 hover:cursor-pointer transition duration-200",
        "p-4",
        className
      )}
      to="/genshin-profiles/$id"
      params={{ id: profileId.toString() }}
      {...props}
    >
      {children}
    </Link>
  )
}
