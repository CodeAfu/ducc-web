import React from "react";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

interface NavLinkProps extends React.HTMLAttributes<HTMLButtonElement> {
  to: string;
  children: React.ReactNode;
  activeClassName?: string;
}

export default function NavLink({
  to,
  children,
  className,
  activeClassName,
  ...props
}: NavLinkProps) {
  return (
    <Button
      variant="link"
      className={cn(
        "px-4 h-full hover:no-underline rounded-none",
        className
      )}
      {...props}
      asChild
    >
      <Link
        to={to}
        activeProps={{
          className: activeClassName ?? "",
        }}
      >
        {children}
      </Link>
    </Button>
  );
}
