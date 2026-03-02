import { createFileRoute } from "@tanstack/react-router";
import Container from "~/components/Container";
import CopiumForm from "./-components/CopiumForm";
import CopiumResults from "./-components/CopiumResults";
import { NotFound } from "~/components/NotFound";

export const Route = createFileRoute("/tools/copium/")({
  component: RouteComponent,
});

function RouteComponent() {
  if (process.env.NODE_ENV !== "development") return <NotFound />;
  return (
    <Container>
      <div className="pt-4 flex flex-col">
        <CopiumForm />
        <CopiumResults />
      </div>
    </Container>
  );
}
