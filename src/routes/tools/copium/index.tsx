import { createFileRoute } from "@tanstack/react-router";
import Container from "~/components/Container";
import CopiumForm from "./-components/CopiumForm";
import CopiumResults from "./-components/CopiumResults";

export const Route = createFileRoute("/tools/copium/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <div className="pt-4 flex flex-col">
        <CopiumForm />
        <CopiumResults />
      </div>
    </Container>
  );
}
