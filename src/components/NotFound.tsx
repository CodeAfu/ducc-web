import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 gap-8">
      <div className="text-gray-200">
        {children || (
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-bold">Error 404</h1>
            <p>The page you are looking for does not exist.</p>
          </div>
        )}
      </div>
      <p className="flex items-center gap-2 flex-wrap">
        <Button
          onClick={() => window.history.back()}
          className="font-semibold"
        >
          Go back
        </Button>
        <Button asChild>
          <Link
            to="/"
            className="font-semibold"
          >
            Start Over
          </Link>
        </Button>
      </p>
    </div>
  );
}
