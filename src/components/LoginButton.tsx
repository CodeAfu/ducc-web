import React, { useState } from "react";
import { Button } from "./ui/button";
import { useSignIn } from "@clerk/tanstack-react-start";
import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import googleIcon from "~/assets/google-icon.png";
import Modal from "./Modal";
import AnimatedButton from "./AnimatedButton";

export default function LoginButton({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoaded, signIn } = useSignIn();

  if (!isLoaded) return null;
  if (typeof window === "undefined") return null;

  const handleGoogleLogin = async () => {
    if (!isLoaded) return;

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
      <AnimatedButton
        className={cn("", className)}
        onClick={() => setIsOpen(true)}
        size="base"
        variant="outline"
        {...props}
      >
        Login
      </AnimatedButton>
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Sign In"
        width="sm"
      >
        <Button
          onClick={handleGoogleLogin}
          disabled={!isLoaded}
          className="w-full"
          variant="outline"
          size="lg"
        >
          {isLoaded ? (
            <div className="inline-flex gap-4 items-center justify-center">
              <img className="w-6 h-6" src={googleIcon} alt="Google Icon" />
              <span>Continue With Google</span>
            </div>
          ) : (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading...
            </>
          )}
        </Button>
      </Modal>
    </>
  );
}
