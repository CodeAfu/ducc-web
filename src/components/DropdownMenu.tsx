import React, { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export default function DropdownMenu({
  trigger,
  children,
  align = "left",
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Handle escape key to close dropdown
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        tabIndex={0}
      >
        {trigger}
      </div>

      {/* Dropdown Content */}
      <div
        ref={dropdownRef}
        className={cn(
          "absolute z-50 mt-2 min-w-[8rem] rounded-md bg-card border border-border shadow-lg",
          "origin-top-right transition-all duration-200 ease-out",
          isOpen
            ? "transform opacity-100 scale-100"
            : "transform opacity-0 scale-95 pointer-events-none",
          align === "right" ? "right-0" : "left-0",
          className
        )}
      >
        <div className="py-1" role="menu" aria-orientation="vertical">
          {children}
        </div>
      </div>
    </div>
  );
}

interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function DropdownItem({
  children,
  className,
  ...props
}: DropdownItemProps) {
  return (
    <button
      className={cn(
        "w-full text-left px-4 py-2 text-sm",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:bg-accent focus:text-accent-foreground",
        "transition-colors duration-150",
        className
      )}
      role="menuitem"
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="h-px my-1 bg-border" role="separator" />;
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
      {children}
    </div>
  );
}
