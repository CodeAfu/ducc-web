import { useAuth } from "@clerk/tanstack-react-start";
import LoadingSpinner from "./LoadingSpinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingSpinner />;
  if (!isSignedIn) {
    return (
      <div className="text-center mt-20 text-muted-foreground">
        Please sign in to view this profile.
      </div>
    );
  }

  return children
}
