import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { MenuItem } from "~/lib/types";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
  useSignIn,
} from "@clerk/tanstack-react-start";
import { Slot } from "@radix-ui/react-slot";

const smallScreenQuery = "(max-width: 767px)";

interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export default function SideNav({
  isOpen,
  onClose,
  className,
  menuItems,
  ...props
}: SideNavProps) {
  const { isLoaded, signIn } = useSignIn();

  const [mounted, setMounted] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(true);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia(smallScreenQuery);
    setIsSmallScreen(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (mounted && !isSmallScreen && isOpen) {
      onClose();
    }
  }, [mounted, isSmallScreen, isOpen, onClose]);

  if (!mounted || !isLoaded) return null;
  if (!isSmallScreen) return null;

  const handleGoogleLogin = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.href,
        redirectUrlComplete: window.location.href,
      });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-99"
          onClick={onClose}
        />
      )}

      {/* Side Navigation */}
      <div
        className={cn(
          "fixed top-0 right-0 z-100 h-screen w-64 bg-card p-6 shadow-lg transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
        {...props}
      >
        <div className="flex flex-col h-full gap-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b-1 py-2">
            <div>
              <UserButton />
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col">
            <ul className="space-y-2 rounded-lg">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    activeProps={{
                      className: "bg-accent/50 text-accent-foreground",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="border-t my-4" />
              <li className="block rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                <SignedOut>
                  <AuthButton onClick={handleGoogleLogin}>
                    Continue With Google
                  </AuthButton>
                </SignedOut>
                <SignedIn>
                  <SignOutButton>
                    <AuthButton>Sign Out</AuthButton>
                  </SignOutButton>
                </SignedIn>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">quek</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AuthButton({
  children,
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "text-left py-2 px-3 w-full h-full active:bg-accent active:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
