import { createFileRoute } from "@tanstack/react-router";
import ColorShowcase from "~/components/ColorShowcase";

export const Route = createFileRoute("/tests/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto">
      <ColorShowcase />
    </div>
  );
}
