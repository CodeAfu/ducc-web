import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BingoCellStates, BingoCellValue } from "~/types/bingo";

type BingoStoreStates = {
  title: string | null
  description: string | null
  cellStates: BingoCellStates;
  selectedCell: keyof BingoCellStates | null;
  bgImage: string | null;
  iconImage: string | null;
  bgIsIcon: boolean;
  showSidebar: boolean;
};

type BingoStoreActions = {
  getCell: (cellKey: keyof BingoCellStates) => BingoCellValue;
  updateCell: (
    cellKey: keyof BingoCellStates,
    value: BingoCellStates[keyof BingoCellStates],
  ) => void;

  setSelectedCell: (cellKey: keyof BingoCellStates | null) => void;
  resetCells: () => void;
  setTitle: (title: string | null) => void;
  setDescription: (description: string | null) => void;
  setBgImage: (image: string | null) => void;
  setIconImage: (image: string | null) => void;
  setBgIsIcon: (display: boolean) => void;
  setShowSidebar: (show: boolean) => void;
  randomizeCells: () => void;
};

type BingoStore = BingoStoreStates & BingoStoreActions;

const createInitialCellStates = (): BingoCellStates => {
  return Object.fromEntries(
    Array.from({ length: 25 }, (_, index) => [`cell${index + 1}`, ""]),
  ) as BingoCellStates;
};

export const useBingoStore = create<BingoStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cellStates: createInitialCellStates(),
      title: "",
      description: "",
      bgImage: "",
      bgIsIcon: true,
      iconImage: "",
      selectedCell: null,
      showSidebar: false,

      // Actions
      getCell: (cellKey) => get().cellStates[cellKey],
      updateCell: (cellKey, value) => {
        set((state) => ({
          cellStates: { ...state.cellStates, [cellKey]: value },
        }));
        console.log(get().cellStates);
      },
      setSelectedCell: (cellKey) => set({ selectedCell: cellKey }),
      resetCells: () => set({ cellStates: createInitialCellStates() }),
      setTitle: (title) => set({ title: title }),
      setDescription: (description) => set({ description: description }),
      setBgImage: (display) => set({ bgImage: display }),
      setIconImage: (image) => set({ iconImage: image }),
      setBgIsIcon: (display) => set({ bgIsIcon: display }),
      setShowSidebar: (show) => set({ showSidebar: show }),
      randomizeCells: () => {
        const currentCells = get().cellStates;
        // Extract all values except cell13

        const entries = Object.entries(currentCells).filter(
          ([key]) => key !== "cell13",
        );
        const values = entries.map(([_, value]) => value);

        // Fisher-Yates shuffle
        for (let i = values.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [values[i], values[j]] = [values[j], values[i]];
        }

        // Reconstruct with shuffled values, preserving cell13
        const shuffled = Object.fromEntries(
          Object.keys(currentCells).map((key) => {
            if (key === "cell13") return [key, currentCells.cell13];
            const index = entries.findIndex(([k]) => k === key);
            return [key, values[index]];
          }),
        ) as BingoCellStates;

        set({ cellStates: shuffled });
      },
    }),
    {
      name: "bingo-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        title: state.title,
        description: state.description,
        cellStates: state.cellStates,
        bgImage: state.bgImage,
        iconImage: state.iconImage,
        bgIsIcon: state.bgIsIcon,
      }),
    },
  ),
);

export const useCellStates = () => useBingoStore((state) => state.cellStates);
export const useGetCell = () => useBingoStore((state) => state.getCell);
export const useUpdateCell = () => useBingoStore((state) => state.updateCell);
export const useClearCells = () => useBingoStore((state) => state.resetCells);

export const useSelectedCell = () =>
  useBingoStore((state) => state.selectedCell);
export const useSetSelectedCell = () =>
  useBingoStore((state) => state.setSelectedCell);

export const useBgImage = () => useBingoStore((state) => state.bgImage);
export const useSetBgImage = () => useBingoStore((state) => state.setBgImage);

export const useIconImage = () => useBingoStore((state) => state.iconImage);
export const useSetIconImage = () =>
  useBingoStore((state) => state.setIconImage);

export const useTitle = () => useBingoStore((state) => state.title)
export const useSetTitle = () => useBingoStore((state) => state.setTitle)

export const useDescription = () => useBingoStore((state) => state.description)
export const useSetDescription = () => useBingoStore((state) => state.setDescription)

export const useBgIsIcon = () => useBingoStore((state) => state.bgIsIcon);
export const useSetBgIsIcon = () => useBingoStore((state) => state.setBgIsIcon);

export const useShowSidebar = () => useBingoStore((state) => state.showSidebar);
export const useSetShowSidebar = () =>
  useBingoStore((state) => state.setShowSidebar);
export const useRandomizeCells = () =>
  useBingoStore((state) => state.randomizeCells);
