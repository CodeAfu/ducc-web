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
      <section className="flex flex-col gap-4 mt-4">
        <div className="w-full max-w-7xl mx-auto gap-4">
          <Button className="w-fit" variant="link" size="sm" asChild>
            <Link to="/tools/bingo">
              <ArrowLeft className="" />
              Go Back
            </Link>
          </Button>
        </div>
        <div className="grid justify-center">
          <BingoCard />
        </div>
        <BingoSettingsSidebarButton />
        <BingoSettingsSidebar />
      </section>
    </Fragment>
  );
}
