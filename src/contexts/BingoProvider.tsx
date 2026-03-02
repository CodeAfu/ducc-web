import { createContext, createRef, useContext, useRef, useState } from "react";

interface BingoContextValue {
  cellRefs: React.RefObject<(HTMLDivElement | null)[]>;
  displayBg: boolean;
  iconImage: string | null;
  selectedCell: HTMLDivElement | null;

  setDisplayBg: React.Dispatch<React.SetStateAction<boolean>>;
  setIconImage: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedCell: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
}

const BingoContext = createContext<BingoContextValue | undefined>(undefined);

export function BingoProvider({ children }: { children: React.ReactNode }) {
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedCell, setSelectedCell] = useState<HTMLDivElement | null>(null);
  const [displayBg, setDisplayBg] = useState<boolean>(true);
  const [iconImage, setIconImage] = useState<string | null>(null);

  if (cellRefs.current.length !== 25) {
    cellRefs.current = Array(25)
      .fill(null)
      .map(() => {
        const ref = createRef<HTMLDivElement>().current;
        return ref;
      });
  }

  const contextValue: BingoContextValue = {
    cellRefs,
    displayBg,
    iconImage,
    selectedCell,

    setDisplayBg,
    setIconImage,
    setSelectedCell,
  };

  return (
    <BingoContext.Provider value={contextValue}>
      {children}
    </BingoContext.Provider>
  );
}

export function useBingoProvider() {
  const context = useContext(BingoContext);

  if (context === undefined) {
    throw new Error("useBingoProvider must be used within a BingoProvider");
  }

  return context;
}
