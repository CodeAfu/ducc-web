import AnimatedButton from "~/components/AnimatedButton";
import {
  useCellStates,
  useClearCells,
  useDescription,
  useIconImage,
  useRandomizeCells,
  useSetBgImage,
  useSetDescription,
  useSetIconImage,
  useUpdateCell,
} from "~/stores/bingoStore";
import { useState } from "react";
import React from "react";
import { BingoCellKey, BingoImageResponse } from "~/types/bingo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import Skeleton from "~/components/Skeleton";

export default function BingoSettingsSidebarContents() {
  const { email } = useRouteContext({ from: "__root__" })
  const queryClient = useQueryClient()

  const cellStates = useCellStates();
  const updateCell = useUpdateCell();
  const clearCells = useClearCells();
  const iconImage = useIconImage();
  const setIconImage = useSetIconImage();
  const setBgImage = useSetBgImage();
  const randomizeCells = useRandomizeCells();
  const description = useDescription();
  const setDescription = useSetDescription();

  const [imageIndex, setImageIndex] = useState(0);
  const [uploadImagePreview, setUploadImagePreview] = useState<string | null>(null);

  const { data: images, isFetching } = useQuery({
    queryKey: ["api", "v3", "images"],
    queryFn: async (): Promise<BingoImageResponse> => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/images`);
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json() as BingoImageResponse;
      return json;
    }
  })

  const { mutate: addImage, isPending } = useMutation({
    mutationFn: async (imageBase64: string) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: imageBase64,
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json();
    },
    onError: (err) => {
      console.error(err)
    },
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["api", "v3", "images"] })
      console.log("Upload Success!", msg)
    }
  })

  const selectPrevImage = () => {
    const newIndex = Math.max(0, imageIndex - 1);
    setImageIndex(newIndex)
    if (images) {
      setIconImage(`data:image/webp;base64,${images[newIndex].img_data}`);
      setBgImage(`data:image/webp;base64,${images[newIndex].img_data}`);
    }
  }

  const selectNextImage = () => {
    const newIndex = Math.min((images!.length ?? 1) - 1, imageIndex + 1)
    setImageIndex(newIndex)
    if (images) {
      setIconImage(`data:image/webp;base64,${images[newIndex].img_data}`);
      setBgImage(`data:image/webp;base64,${images[newIndex].img_data}`);
    }
  }

  const setImageByIndex = (idx: number) => {
    setImageIndex(idx);
    if (images) {
      setIconImage(`data:image/webp;base64,${images[idx].img_data}`);
      setBgImage(`data:image/webp;base64,${images[idx].img_data}`);
    }
  }

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
          <AnimatedButton onClick={randomizeCells}>Shuffle</AnimatedButton>
          <AnimatedButton onClick={() => { }}>Upload Image</AnimatedButton>
          <AnimatedButton>Save</AnimatedButton>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:px-8 sm:px-4 px-2 pb-4">
        <h4>Bingo Images{" "}
          {images && (
            <span className="text-muted-foreground">
              ({images.length})
            </span>
          )}
        </h4>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-0.5">
            {isFetching || !images ? (
              <React.Fragment>
                <Skeleton className="size-16" />
                <Skeleton className="size-16" />
              </React.Fragment>
            ) : (
              images.map((img, idx) => (
                <button
                  key={`bing-image-${img.id}`}
                  className="size-16 overflow-hidden hover:scale-105 transtion duration-200 hover:cursor-pointer"
                  onClick={() => setImageByIndex(idx)}
                >
                  <img src={`data:image/webp;base64,${img.img_data}`} className="w-full h-full object-cover" />
                </button>
              ))
            )}
          </div>
          <div className="flex gap-1 items-center">
            <button
              onClick={selectPrevImage}
              disabled={imageIndex <= 0}
              className="text-xl px-2 py-1 bg-primary rounded h-fit hover:bg-primary/80 transition duration-200
              disabled:opacity-50 disabled:pointer-events-none">
              &lt;
            </button>
            <div className="border rounded size-24 flex items-center justify-center overflow-hidden select-none">
              {isFetching || !images ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <img src={iconImage || undefined} className="w-full h-full object-cover" />
              )}
            </div>
            <button
              onClick={selectNextImage}
              disabled={images && imageIndex >= images.length - 1}
              className="text-xl px-2 py-1 bg-primary rounded h-fit hover:bg-primary/80 transition duration-200
              disabled:opacity-50 disabled:pointer-events-none">
              &gt;
            </button>
          </div>
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
                <div className="text-sm text-muted-foreground ml-1">{key.slice(4)}</div>
                <input
                  type="text"
                  autoCapitalize="sentences"
                  onInput={(e) => updateCell(key as BingoCellKey, e.currentTarget.value)}
                  className="text-sm w-full outline-none rounded border border-muted-foreground py-1 px-2"
                  value={value}
                />
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
