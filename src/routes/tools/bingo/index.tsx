import { createFileRoute, Link } from "@tanstack/react-router";
import Container from "~/components/Container";
import BaseCard from "../../../components/BaseCard";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/tools/bingo/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container className="flex flex-col gap-4">
      <div className="md:mt-12 mt-4 flex gap-4 border-b pb-4">
        <div className="flex-1 flex items-center">
          <h1 className="text-2xl md:text-3xl">Browse</h1>
        </div>
        <Button size="default" variant="outline" asChild>
          <Link to="/tools/bingo/create">Create</Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        {/* Query DB for cards */}
        <BaseCard className="flex flex-col justify-between gap-2 h-75 touch-manipulation">
          <h3 className="font-semibold tracking-tight text-lg">Title</h3>
          <div className="w-full aspect-square max-h-full border p-2 overflow-hidden">Img Container</div>
          <div className="self-end flex">
            <Button variant="link" size="sm">
              View
            </Button>
            <Button variant="link" size="sm">
              Edit
            </Button>
          </div>
        </BaseCard>
        <BaseCard className="flex flex-col gap-2 h-75 touch-manipulation">
          <h3 className="font-semibold tracking-tight text-lg">Title</h3>
        </BaseCard>
        <BaseCard className="flex flex-col gap-2 h-75 touch-manipulation">
          <h3 className="font-semibold tracking-tight text-lg">Title</h3>
        </BaseCard>
      </div>
    </Container>
  );
}
