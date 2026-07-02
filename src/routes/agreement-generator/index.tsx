import { createFileRoute } from "@tanstack/react-router";
import Container from "~/components/Container";
import { DocumentSection } from "./-components/DocumentSection";

export const Route = createFileRoute("/agreement-generator/")({
  component: AgreementGeneratorPage,
});

function AgreementGeneratorPage() {
  return (
    <Container className="mb-32">
      <h1 className="my-4 text-2xl md:text-3xl font-bold tracking-tight truncate">Astral Agreement</h1>
      <DocumentSection />
    </Container>
  )
}

