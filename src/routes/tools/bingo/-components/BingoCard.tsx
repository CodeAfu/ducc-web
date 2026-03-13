import {
  ComponentProps,
  forwardRef,
  HTMLAttributes,
  ClipboardEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import { cn } from "~/lib/utils";
import {
  useBgImage,
  useSetBgImage,
  useIconImage,
  useSetIconImage,
  useBgIsIcon,
  useUpdateCell,
  useBingoStore,
  useSetTitle,
  useTitle,
} from "~/stores/bingoStore";
import LoadingSpinner from "~/components/LoadingSpinner";
import { BingoCellStates, BingoImageResponse } from "~/types/bingo";
import { getCellKey } from "~/utils/bingo";
import { useQuery } from "@tanstack/react-query";

export default function BingoCard({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: images, isLoading: isFetchingImage } = useQuery({
    queryKey: ["api", "v3", "images"],
    queryFn: async (): Promise<BingoImageResponse> => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/images`);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 70,
  })

  const bgImage = useBgImage();
  const setBgImage = useSetBgImage();
  const iconImage = useIconImage();
  const setIconImage = useSetIconImage();
  const bgIsIcon = useBgIsIcon();
  const title = useTitle();
  const setTitle = useSetTitle();

  const displayImage = bgIsIcon ? iconImage : bgImage;

  useEffect(() => {
    if (isFetchingImage) return;
    setIsLoading(false);
  }, [isFetchingImage]);

  // useEffect(() => {
  //   if (!images) return;
  //   setBgImage(`data:image/webp;base64,${images[0].img_data}`);
  //   setIconImage(`data:image/webp;base64,${images[0].img_data}`);
  // }, [images]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "h-[70vh] flex flex-col items-center justify-center",
          className,
        )}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-xl">
      <input
        type="text"
        maxLength={80}
        autoCapitalize="sentences"
        className="sm:text-2xl text-lg mb-4 border-none outline-none text-primary-foreground"
        placeholder="Bingo Card Name"
        defaultValue={title ?? ""}
        onInput={(e) => setTitle(e.currentTarget.value)}
      />
      <div
        id="bingo-card"
        className={cn(
          "relative bg-gray-100 text-black sm:p-8 p-4 rounded-lg w-full",
          className,
        )}
        {...props}
      >
        {/* Heading */}
        <Row className="pb-2 sm:text-5xl text-4xl">
          {Array.from("BINGO").map((char, index) => (
            <Cell
              key={index}
              cellKey={`cell${index}`}
              className="border-0 items-end h-fit font-bold select-none"
            >
              {char}
            </Cell>
          ))}
        </Row>

        <div className="relative w-full">
          {/* BG Image */}
          <div
            className="absolute opacity-10 inset-0 bg-contain bg-center bg-no-repeat rounded-lg z-0 pointer-events-none"
            style={{ backgroundImage: `url(${displayImage})` }}
          />

          {/* Cells */}
          {[...Array(5)].map((_, rowIndex) => (
            <Row key={`row${rowIndex}`}>
              {[...Array(5)].map((_, cellIndex) => (
                <Cell
                  key={`cell${rowIndex}-${cellIndex}`}
                  cellKey={getCellKey(rowIndex, cellIndex)}
                >
                  {rowIndex === 2 && cellIndex === 2 ? (
                    <div className="w-full h-full flex items-center justify-center z-1">
                      {iconImage ? (
                        <img src={iconImage || undefined} />
                      ) : (
                        <p className="text-2xl">FREE</p>
                      )}
                    </div>
                  ) : (
                    <BingoInput cellKey={getCellKey(rowIndex, cellIndex)} />
                  )}
                </Cell>
              ))}
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex w-full", className)} {...props}>
      {children}
    </div>
  );
}

const Cell = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { cellKey: keyof BingoCellStates }
>(({ className, children, cellKey, ...props }, ref) => {
  const [selected, setSelected] = useState<boolean>(false);

  const handleClick = () => {
    setSelected(true);
  };

  const handleBlur = () => {
    setSelected(false);
  };

  return (
    <div
      className={cn(
        "aspect-square flex-1 min-w-0 border flex items-center justify-center",
        selected ? "" : "",
        className,
      )}
      onClick={handleClick}
      onBlur={handleBlur}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});
Cell.displayName = "Cell";

const BingoInput = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    cellKey: keyof BingoCellStates;
    placeholder?: string;
  }
>(({ cellKey, placeholder, ...props }, ref) => {
  const [fontSize, setFontSize] = useState(32);
  const [isEmpty, setIsEmpty] = useState(true);
  // const getCell = useGetCell();
  const cellContent = useBingoStore((state) => state.cellStates[cellKey]) ?? "";
  const updateCell = useUpdateCell();

  const divRef = useRef<HTMLDivElement>(null);
  const combinedRef = ref || divRef;

  // const cellContent = getCell(cellKey) ?? "";

  const adjustContent = () => {
    const $div =
      typeof combinedRef === "function" ? divRef.current : combinedRef?.current;
    if (!$div) return;

    const $container = $div.parentElement;
    if (!$container) return;

    // Start with base font size
    let currentFontSize = 32;
    $div.style.fontSize = `${currentFontSize}px`;

    // Get container dimensions with some padding
    const containerWidth = $container.clientWidth;
    const containerHeight = $container.clientHeight;

    // Check for single word overflow by measuring text width
    const text = $div.textContent || "";
    const words = text.split(/\s+/).filter((word) => word.length > 0);

    // Create a temporary span to measure word widths
    const $measureSpan = document.createElement("span");
    $measureSpan.style.visibility = "hidden";
    $measureSpan.style.position = "absolute";
    $measureSpan.style.fontSize = `${currentFontSize}px`;
    $measureSpan.style.fontFamily = getComputedStyle($div).fontFamily;
    $measureSpan.style.whiteSpace = "nowrap";
    document.body.appendChild($measureSpan);

    // Check if any single word is too wide
    let maxWordWidth = 0;
    for (const word of words) {
      $measureSpan.textContent = word;
      const wordWidth = $measureSpan.offsetWidth;
      maxWordWidth = Math.max(maxWordWidth, wordWidth);
    }

    // Scale down font if any word is too wide
    while (maxWordWidth > containerWidth && currentFontSize > 8) {
      currentFontSize -= 1;
      $measureSpan.style.fontSize = `${currentFontSize}px`;
      $div.style.fontSize = `${currentFontSize}px`;

      // Re-measure max word width
      maxWordWidth = 0;
      for (const word of words) {
        $measureSpan.textContent = word;
        const wordWidth = $measureSpan.offsetWidth;
        maxWordWidth = Math.max(maxWordWidth, wordWidth);
      }
    }

    // Clean up measuring element
    document.body.removeChild($measureSpan);

    // Check for overall content overflow (height/width)
    while (
      ($div.scrollHeight > containerHeight ||
        $div.scrollWidth > containerWidth) &&
      currentFontSize > 8
    ) {
      currentFontSize -= 1;
      $div.style.fontSize = `${currentFontSize}px`;
    }

    setFontSize(currentFontSize);
  };

  const handleInput = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const $div = e.currentTarget;
    const text = $div.textContent || "";
    setIsEmpty(text.trim().length === 0);
    updateCell(cellKey, text);
    adjustContent();
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    selection.collapseToEnd();
    updateCell(cellKey, text);
    adjustContent();
  };

  useEffect(() => {
    const $div =
      typeof combinedRef === "function" ? divRef.current : combinedRef?.current;
    if (!$div || $div.textContent === cellContent) return;
    $div.textContent = cellContent;
  }, [cellContent]);

  useEffect(() => {
    const div =
      typeof combinedRef === "function" ? divRef.current : combinedRef?.current;
    if (!div) return;

    const container = div.parentElement;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      adjustContent();
    });

    observer.observe(container);

    // Cleanup on unmount
    return () => {
      observer.disconnect();
    };
  }, [cellContent]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      <div
        ref={combinedRef}
        contentEditable
        className={cn(
          "w-full h-full text-center tracking-tight text-black border-none outline-none overflow-hidden resize-none break-words whitespace-pre-wrap flex flex-col items-center justify-center cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-purple-700 transition duration-200",
          isEmpty && "caret-transparent",
        )}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: "1.1",
        }}
        onInput={handleInput}
        onPaste={handlePaste}
        spellCheck={false}
        data-placeholder={placeholder}
        defaultValue={cellContent}
        {...props}
      />
      {isEmpty && (
        <div
          className="absolute text-gray-400 pointer-events-none text-center"
          style={{ fontSize: `${fontSize}px` }}
        ></div>
      )}
    </div>
  );
});
BingoInput.displayName = "BingoInput";
