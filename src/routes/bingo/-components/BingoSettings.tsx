import { useEffect, useState } from "react";
import BaseCard from "~/components/BaseCard";
import { Button } from "~/components/ui/button";
import { useClearCells } from "~/stores/bingoStore";

export default function BingoSettings() {
  const clearCells = useClearCells();

  return (
    <BaseCard className="hidden xl:flex flex-col gap-2 h-fit w-fit basis-xs">
      <div className="flex gap-2">
        <Button className="flex-1">Upload Icon</Button>
        <Button className="flex-1">Upload BG</Button>
      </div>
      <Button variant="destructive" onClick={clearCells}>
        Clear
      </Button>
    </BaseCard>
  );
}
