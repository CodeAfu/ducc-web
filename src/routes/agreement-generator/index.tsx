import { createFileRoute } from "@tanstack/react-router";
import Container from "~/components/Container";
import { DocumentSection } from "./-components/DocumentSection";
import { Controls } from "./-components/Controls";
import { useState } from "react";
import { FormValues } from "./-types";

export const Route = createFileRoute("/agreement-generator/")({
  component: AgreementGeneratorPage,
});

function AgreementGeneratorPage() {
  const [form, setForm] = useState<FormValues>({})
  return (
    <Container className="mb-32 space-y-4">
      <h1 className="my-4 text-2xl md:text-3xl font-bold tracking-tight truncate">Astral Agreement</h1>
      <DocumentSection form={form} setForm={setForm} />
      <Controls form={form} />
    </Container>
  )
}

