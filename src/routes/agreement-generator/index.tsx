import { createFileRoute } from "@tanstack/react-router";
import Container from "~/components/Container";
import { Paragraph } from "./-components/Paragraph";
import { AgreementInput } from "./-components/AgreementInput";

export const Route = createFileRoute("/agreement-generator/")({
  component: AgreementGeneratorPage,
});

function AgreementGeneratorPage() {
  return (
    <Container>
      <h1 className="my-4 text-2xl md:text-3xl font-bold tracking-tight truncate">Astral Agreement</h1>
      <section
        dir="rtl"
        className="border shadow flex flex-col gap-6 py-4 px-8 bg-gray-100/10 text-gray-200 font-faruma font-semibold md:text-xl rounded"
      >
        <Paragraph>
          މިއީ، މއ. އަސްޓްރަލް ބަހައިގެން ގ. ހިޔާ އަތިއްޔާ އަލީ އަށް ލިބުނު ބައިގައި ކޮށްފަހުރި އިމާރާތުގެ{" "}
          <AgreementInput placeholder="ދެވަނަބުރި" />
          ބުރި{" "}
          <AgreementInput className="max-w-80" placeholder="އާދަމް މޫސާ (ގ. ރަށުގެނަން، މއ. ގެނަން)" />
          އަށް ކުއްޔަށް (އެއް ރޫމް އެޕާޓްމަންތް ފްލެޓް) ދިނުމަށްކުރި އެގްރިމަންޓްއެކެވެ.
        </Paragraph>

        <Paragraph>
          1- މިއެގްރިމަންޓް އެކުލެވިގެންވަނީ 20 މާއްދާގެ މައްޗަށެވެ.
        </Paragraph>
      </section>
    </Container>
  )
}

