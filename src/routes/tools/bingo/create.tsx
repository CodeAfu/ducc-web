import { createFileRoute, Link } from "@tanstack/react-router";
import Container from "~/components/Container";
import BingoCard from "./-components/BingoCard";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import BingoSettingsSidebarButton from "./-components/BingoSettingsSidebarButton";
import BingoSettingsSidebar from "./-components/BingoSettingsSidebar";

export const Route = createFileRoute("/tools/bingo/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Fragment>
      <Container>
        <div className="mt-4 flex flex-col gap-4">
          <Button className="w-fit" variant="link" size="sm" asChild>
            <Link to="/tools/bingo">
              <ArrowLeft className="" />
              Go Back
            </Link>
          </Button>
          <div className="grid gap-2 xl:grid-cols-[260px_1fr_260px] grid-cols-1">
            <BingoCard className="xl:col-start-2 place-self-center" />
            {/* <BingoSettings /> */}
          </div>
        </div>
      </Container>
      <BingoSettingsSidebarButton />
      <BingoSettingsSidebar />
    </Fragment>
  );
}
