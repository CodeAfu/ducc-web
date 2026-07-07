import { createFileRoute } from "@tanstack/react-router";
import Container from "~/components/Container";
import { DocumentSection } from "./-components/DocumentSection";
import { Controls } from "./-components/Controls";
import { useState } from "react";
import { FormValues } from "./-types";
import { ModalPDFViewer } from "./-components/PDFViewer";

export const Route = createFileRoute("/agreement-generator/")({
  component: AgreementGeneratorPage,
});

function AgreementGeneratorPage() {
  const [form, setForm] = useState<FormValues>({})
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  return (
    <Container className="mb-32 space-y-4">
      <h1 className="my-4 text-2xl md:text-3xl font-bold tracking-tight truncate">Astral Agreement</h1>
      <DocumentSection form={form} setForm={setForm} />
      <Controls form={form} url={pdfUrl} setUrl={setPdfUrl} setOpen={setPdfModalOpen} />
      <ModalPDFViewer url={pdfUrl} isOpen={pdfModalOpen} onClose={() => setPdfModalOpen(false)} />
    </Container>
  )
}

