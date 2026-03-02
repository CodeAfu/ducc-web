import AnimatedButton from "~/components/AnimatedButton";
import {
  useClearCells,
  useRandomizeCells,
  useSetBgImage,
  useSetIconImage,
} from "~/stores/bingoStore";
import closeyu from "~/assets/bingo-bg/closeyu.webp";
import closezuha from "~/assets/bingo-bg/closezuha.webp";
import { useRef } from "react";

const imageList = [closezuha, closeyu];

export default function BingoSettingsSidebarContents() {
  const numRef = useRef(0);
  const clearCells = useClearCells();
  const setIconImage = useSetIconImage();
  const setBgImage = useSetBgImage();
  const randomizeCells = useRandomizeCells();

  const handleSwitchImage = () => {
    numRef.current = numRef.current + 1;
    setBgImage(imageList[numRef.current % 2]);
    setIconImage(imageList[numRef.current % 2]);
  };

  return (
    <div className="flex flex-col gap-2 md:px-8 sm:px-4 px-2 overflow-hidden">
      <h1 className="mt-4 mb-2 font-medium text-center select-none text-xl">
        Settings
      </h1>
      <hr className="mb-2" />
      <div className="flex flex-row justify-center items-center gap-2">
        <AnimatedButton onClick={clearCells} variant="destructive" className="">
          Clear Cells
        </AnimatedButton>
        <AnimatedButton onClick={handleSwitchImage}>Switch BG</AnimatedButton>
        <AnimatedButton onClick={randomizeCells}>Shuffle</AnimatedButton>
      </div>
    </div>
  );
}
