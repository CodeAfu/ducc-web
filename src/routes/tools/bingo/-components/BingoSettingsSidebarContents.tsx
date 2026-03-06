import AnimatedButton from "~/components/AnimatedButton";
import {
  useCellStates,
  useClearCells,
  useDescription,
  useRandomizeCells,
  useSetBgImage,
  useSetDescription,
  useSetIconImage,
  useUpdateCell,
} from "~/stores/bingoStore";
import closeyu from "~/assets/bingo-bg/closeyu.webp";
import closezuha from "~/assets/bingo-bg/closezuha.webp";
import { useRef } from "react";
import React from "react";
import { BingoCellKey } from "~/types/bingo";

const imageList = [closezuha, closeyu];

export default function BingoSettingsSidebarContents() {
  const numRef = useRef(0);
  const cellStates = useCellStates();
  const updateCell = useUpdateCell();
  const clearCells = useClearCells();
  const setIconImage = useSetIconImage();
  const setBgImage = useSetBgImage();
  const randomizeCells = useRandomizeCells();
  const description = useDescription();
  const setDescription = useSetDescription();

  const handleSwitchImage = () => {
    numRef.current = numRef.current + 1;
    setBgImage(imageList[numRef.current % 2]);
    setIconImage(imageList[numRef.current % 2]);
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex flex-col gap-2 md:px-8 sm:px-4 px-2 pb-4">
        <h1 className="mt-4 mb-2 font-medium select-none text-xl ">
          Options
        </h1>
        <div className="flex flex-row flex-wrap items-center gap-3">
          <AnimatedButton onClick={clearCells} variant="destructive" className="">
            Clear Cells
          </AnimatedButton>
          <AnimatedButton onClick={handleSwitchImage}>Switch BG</AnimatedButton>
          <AnimatedButton onClick={randomizeCells}>Shuffle</AnimatedButton>
          <AnimatedButton>Save</AnimatedButton>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:px-8 sm:px-4 px-2 pb-4">
        <h4>
          Description{" "}
          <span className="text-muted-foreground">(Optional)</span>
        </h4>
        <textarea
          className="border border-muted-foreground rounded-xl h-32 outline-none text-start resize-none p-2 text-sm"
          onInput={(e) => setDescription(e.currentTarget.value.trim())}
          defaultValue={description ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2 md:px-8 sm:px-4 px-2 pb-4">
        <h4>
          Cells
        </h4>
        <div className="grid grid-cols-[auto_1fr] sm:gap-x-4 items-center gap-x-2 gap-y-1">
          {Object.entries(cellStates)
            .sort(([a], [b]) => {
              const numA = parseInt(a.replace("cell", ""));
              const numB = parseInt(b.replace("cell", ""));
              return numA - numB;
            })
            .map(([key, value]) => (
              <React.Fragment key={key}>
                <div className="text-sm text-muted-foreground">{key}: </div>
                <input
                  type="text"
                  onInput={(e) => updateCell(key as BingoCellKey, e.currentTarget.value)}
                  className="text-sm outline-none rounded border border-muted-foreground py-1 px-2"
                  value={value}
                />
              </React.Fragment>
            ))}
        </div>
      </div>

    </div>
  );
}
